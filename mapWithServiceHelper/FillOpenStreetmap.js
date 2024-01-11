

    var map = L.map('map').setView([48.130064, 11.583815], 14);
    mapLink =
    '<a href="https://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
}).addTo(map);
    var marker = L.marker([48.130064, 11.583815],
    {draggable: true,        // Make the icon dragable
        title: 'Hover Text',     // Add a title
        opacity: 0.5}            // Adjust the opacity
    )
    .addTo(map)

    .bindPopup("<b>Deutsches Museum</b><br>Museumsinsel München")
    .openPopup();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./mapWithServiceHelper/sw.js')
            .then(reg => console.log('Registrierung erfolgreich. Scope ist ' + reg))
            .catch(err => console.log('Registrierung fehlgeschlagen mit ' + err));
    }
