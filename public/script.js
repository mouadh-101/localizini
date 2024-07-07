// Initialize the platform object
var platform = new H.service.Platform({
    'apikey': '4FfYg63dy24nuKJqx4QDKITYYSN_bU8gMo9dd0CfsD8'
});

// Obtain the default map types from the platform object
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) the map
var map = new H.Map(
    document.getElementById('map'),
    defaultLayers.vector.normal.map,
    {
        zoom: 2,
        center: { lng: 0, lat: 0 }
    }
);

// Enable map event system
var mapEvents = new H.mapevents.MapEvents(map);
var behavior = new H.mapevents.Behavior(mapEvents);

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

async function fetchPlaces() {
    try {
        const response = await fetch('/random-places');
        const places = await response.json();
        
        const placesList = document.getElementById('places-list');
        placesList.innerHTML = '';
        
        places.forEach(place => {
            const listItem = document.createElement('li');
            listItem.textContent = place.place_name;
            listItem.addEventListener('click', () => {
                document.getElementById('locationName').innerText = place.place_name;
                alert(`Place: ${place.place_name}\nLatitude: ${place.latitude}\nLongitude: ${place.longitude}`);
                
                map.setCenter({ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude)});
                const marker = new H.map.Marker({
                    lat: parseFloat(place.latitude),
                    lng: parseFloat(place.longitude)
                    
                    
                });
                console.log(`geolocation :${place.latitude},${place.longitude}`);
                console.log(`geolocation :${parseFloat(place.latitude)},${parseFloat(place.longitude)}`);

                map.addObject(marker);
               
            });
            placesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}


// Fetch places when the page loads
document.addEventListener('DOMContentLoaded', fetchPlaces);
