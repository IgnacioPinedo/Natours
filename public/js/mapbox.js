/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaWduYWNpb2JwaW5lZG8iLCJhIjoiY2thc2p2aW5uMDBkazMwcW5hd3BreTBtbiJ9.TZoSx_jCRGYvr4m_UTpTxw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ignaciobpinedo/ckasjx8vb0tkm1iqbq7rrl286',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 5,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
