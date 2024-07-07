const express = require('express');
const axios = require('axios');
const path = require('path');



const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.get('/random-places', async (req, res) => {
    const numPlaces = req.query.num || 10; // Number of random places to fetch, default is 10

    try {
        const response = await axios.get(`https://randomuser.me/api/?results=${numPlaces}`);
        const data = response.data;

        const places = data.results.map(result => ({
            place_name: `${result.location.city}, ${result.location.country}`,
            latitude: result.location.coordinates.latitude,
            longitude: result.location.coordinates.longitude
        }));

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch random places' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
