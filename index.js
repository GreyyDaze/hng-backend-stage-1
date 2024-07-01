import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const IPINFO_API_KEY = process.env.IPINFO_API_KEY;
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

app.get("/api/hello", async (req, res) => {
    const visitorName = req.query.visitor_name || "Guest";
  
    // Get the client's IP address from 'x-forwarded-for' header or fallback to req.ip
    const clientIp = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0]
      : req.connection.remoteAddress;
    console.log(req.connection.remoteAddress);
    
    try {
      // Fetch location data from ipinfo
      const locationResponse = await axios.get(
        `https://ipinfo.io/${clientIp}?token=${IPINFO_API_KEY}`
      );
      const locationData = locationResponse.data;
      const city = locationData.city;
      const country = locationData.country;
  
      // Fetch weather data from OpenWeatherMap
      const weatherResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
      );
      const weatherData = weatherResponse.data;
      const temperature = weatherData.main.temp;
  
      // Respond with the gathered data
      res.json({
        client_ip: clientIp,
        location: city,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Unable to get location or weather data" });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
