document.addEventListener("DOMContentLoaded", function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoibmV3dHJhbCIsImEiOiJjazJrcDY4Y2gxMmg3M2JvazU4OXV6NHZqIn0.VO5GkvBq_PSJHvX7T8H9jQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/newtral/cmdh5usg7000a01sa6jknc8d9',
    center: [-3.7038, 40.4168],
    zoom: 5
  });

  map.on('load', function () {
    // Add source
    map.addSource('datos_alcaldes_procesado', {
      type: 'vector',
      url: 'mapbox://newtral.8r5gq32o'
    });

    // Add layer
    map.addLayer({
      id: 'datos_alcaldes_procesado',
      type: 'fill',
      source: 'datos_alcaldes_procesado',
      'source-layer': 'datos_alcaldes_procesado',
      paint: {
        'fill-color': [
          'case',
        ['==', ['get', 'total_dias'], null], '#e8f9f7',
          ['<', ['to-number', ['get', 'total_dias']], 768], '#DFF5DC',
          ['<', ['to-number', ['get', 'total_dias']], 1000], '#D5F5DB',
          ['<', ['to-number', ['get', 'total_dias']], 1500], '#B6F0CE',
          ['<', ['to-number', ['get', 'total_dias']], 2000], '#7CF8C4',
          ['<', ['to-number', ['get', 'total_dias']], 2500], '#47F5B9',
          ['<', ['to-number', ['get', 'total_dias']], 3692], '#01f3b3',
          ['<', ['to-number', ['get', 'total_dias']], 5840], '#00DEA3',
          ['<', ['to-number', ['get', 'total_dias']], 16887], '#02B382',
          '#e8f9f7'
        ],
        'fill-opacity': 1,
        'fill-outline-color': '#DBDBDB'
      }
    });

    // Pop-up
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    function showPopup(feature, lngLat) {
      let diasCargo = feature.properties.dias_cargo || 'Sin información';
      let municipio = feature.properties.nombre_municipio || 'Sin información';
      let alcalde = feature.properties.nombre_completo || 'Sin información';
      let legislaturas = feature.properties.legislaturas_cargo || 'Sin información';

      let popupHTML = `
        <div class="popup-container">
          <div><span class="popup-titulo">Días en el cargo:</span> <span class="popup-construccion">${diasCargo}</span></div>
          <div class="popup-etiqueta"><b>Municipio:</b> ${municipio}</div>
          <div class="popup-etiqueta"><b>Alcalde:</b> ${alcalde}</div>
          <div class="popup-etiqueta"><b>Legislaturas en el cargo:</b> ${legislaturas}</div>
        </div>
      `;

      popup.setLngLat(lngLat).setHTML(popupHTML).addTo(map);
    }

    map.on('mousemove', 'datos_alcaldes_procesado', function (e) {
      if (e.features && e.features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        showPopup(e.features[0], e.lngLat);
      }
    });

    map.on('mouseleave', 'datos_alcaldes_procesado', function () {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    // Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "   Buscar ubicación...",
      marker: false
    });
    document.getElementById("geocoder-container").appendChild(geocoder.onAdd(map));
  });
});
