'use exact';
const axios = require('axios');

const getWeather = location => {
    return new Promise(async (resolve, reject) => {
        try {
            const weatherConditions = await axios.get(
                'https://api.weatherapi.com/v1/current.json',
                {
                    params:{
                        key: process.env.WEATHER_API_KEY,
                        q: location,
                        days:3
                    }
                }
            );
            resolve(weatherConditions.data);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = getWeather;