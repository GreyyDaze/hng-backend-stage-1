import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || "Guest";

    const clientIp = req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'].split(',')[0]
        : req.connection.remoteAddress;

    try {
        // Fetch location and weather data from WeatherAPI
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${clientIp}`);
        const weatherData = weatherResponse.data;
        
        const city = weatherData.location.name;
        const temperature = weatherData.current.temp_c;

        // Respond with the gathered data
        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to get location or weather data" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
