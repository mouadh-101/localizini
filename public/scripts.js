const map = L.map('map').setView([36.8065, 10.1815], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function showLocation(place) {
  axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`)
    .then(response => {
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        const lat = location.lat;
        const lon = location.lon;
        map.setView([lat, lon], 13);
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${place}</b>`)
          .openPopup();
      } else {
        alert('Location not found');
      }
    })
    .catch(error => {
      console.error('Error fetching location data:', error);
    });
}

async function fetchPlaces() {
  try {
    const response = await fetch('/random-places');  // Make sure your server is set up to handle this route
    const places = await response.json();

    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
      const listItem = document.createElement('li');
      listItem.textContent = place.place_name;
      listItem.addEventListener('click', () => {
        showLocation(place.place_name);
      });
      placesList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching places:', error);
  }
}

// Fetch places when the page loads
document.addEventListener('DOMContentLoaded', fetchPlaces);
