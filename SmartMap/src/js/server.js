// server.js


const express = require('express');
const cors = require('cors');
import('node-fetch').then((nodeFetch) => {
    const fetch = nodeFetch.default;})

const app = express();
const port = 3001;

app.use(cors());

app.get('/wikipedia', async (req, res) => {
    const { lat, lon } = req.query;

    const apiUrl = 'https://en.wikipedia.org/w/api.php';
    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        generator: 'geosearch',
        ggscoord: `${lat}|${lon}`,
        ggsradius: 1000,
        ggslimit: 1,
        prop: 'extracts',
        exintro: true,
        explaintext: true,
    });

    try {
        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
