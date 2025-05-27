'use exact';
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { cityParser } = require('../utils');
const { time } = require('console');

const CACHE_PATH = path.resolve(__dirname, 'cityCache.json');

const formatData = data =>{
    if (data.temperature) {
        return{
            location: data.location,
            condition: data.weatherCondition.description.text,
            temperature: data.temperature,
        }
    } else {
        return{
            forecastDays: data.forecastDays
        }
    }
}

const readCache = () =>{
    try {
        const rawData = fs.readFileSync(CACHE_PATH);
        return JSON.parse(rawData);
    } catch (err) {
        console.log(err);
        return{};
    }
};

const writeCache = cache =>{
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
};

const getWeather = data => {
    let city;
    return new Promise(async (resolve, reject) => {
        try {
            city = cityParser(data.city).toLowerCase();
            const cache = readCache();
            let coordinates = cache[city];
            if (!coordinates) {
                const res = await axios.get(`${process.env.MAPS_API_BASE_URL}/maps/api/geocode/json?parameters`,
                {
                    params:{
                        key:process.env.WEATHER_API_KEY,
                        address:city
                    }
                });

                if(!res.data.results || res.data.results.length === 0) {
                    throw new Error('No location found for the given address.');
                }

                coordinates = {
                    latitude: res.data.results[0].geometry.location.lat,
                    longitude: res.data.results[0].geometry.location.lng
                };

                cache[city] = coordinates;
                writeCache(cache);
            }
            if (!data.time) {
                const weatherConditions = await axios.get(
                    `${process.env.WEATHER_API_BASE_URL}/v1/currentConditions:lookup?key=${process.env.WEATHER_API_KEY}&location.latitude=${coordinates.latitude}&location.longitude=${coordinates.longitude}&unitsSystem=METRIC`
                );
                resolve(formatData({...weatherConditions.data, location:city}));
            } else {
                const weatherForecast = await axios.get(
                    `${process.env.WEATHER_API_BASE_URL}/v1/forecast/days:lookup?key=${process.env.WEATHER_API_KEY}&location.latitude=${coordinates.latitude}&location.longitude=${coordinates.longitude}&unitsSystem=METRIC&days=3`
                );
                resolve(formatData(weatherForecast.data));
            }

            
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = getWeather;