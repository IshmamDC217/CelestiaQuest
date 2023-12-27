const request = require('superagent');

async function fetchAPOD() {
    const apiKey = process.env.NASA_API_KEY;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    const response = await request.get(url);
    return response.body;
}

async function fetchMarsRoverPhotos(sol, camera) {
    const apiKey = process.env.NASA_API_KEY;
    // Construct the URL with default parameters if none are provided
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&camera=${camera}&api_key=${apiKey}`;
    const response = await request.get(url);
    return response.body; // Make sure this matches the data structure from NASA's API
}

async function fetchNasaImages(query) {
    const url = `https://images-api.nasa.gov/search?q=${query}`;
    const response = await request.get(url);
    return response.body; // Again, ensure this matches the expected data structure
}


module.exports = {
    fetchAPOD,
    fetchMarsRoverPhotos,
    fetchNasaImages
};

