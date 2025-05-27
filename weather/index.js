'use exact';
const axios = require('axios');

const formatData = data =>{
    return{
        location: data.location,
        condition: data.weatherCondition.description.text,
        temperature: data.temperature,
    }
}

const getWeather = location => {
    let city = undefined;
    return new Promise(async (resolve, reject) => {
        try {
            location = location.replace("?", "");
            city = location;
            location = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?parameters`,
                {
                    params:{
                        key:process.env.WEATHER_API_KEY,
                        address:location
                    }
                }
            ).then(res =>{
                //NEED OPTIMIZATION FOR WHEN THERE IS MORE THAN 1 RESULT
                return {
                    latitude: res.data.results[0].geometry.location.lat,
                    longitude: res.data.results[0].geometry.location.lng
                }
            })
            const weatherConditions = await axios.get(
                `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.WEATHER_API_KEY}&location.latitude=${location.latitude}&location.longitude=${location.longitude}&unitsSystem=METRIC`
            );
            resolve(formatData({...weatherConditions.data, location:city}));
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = getWeather;