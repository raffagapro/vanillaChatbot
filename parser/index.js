'use strict'
const colors = require('colors');
const moment = require('moment');

const getFeel = temp =>{
    if (temp < 5) return 'It is shivering cold!';
    else if (temp >= 5 && temp < 15) return 'It is kinda chilly!'
    else if (temp >= 15 && temp < 25) return 'It is cool as a cucumber.'
    else if (temp >= 25 && temp < 32) return 'It is quite warm.'
    else if (temp >= 32 && temp < 40) return 'Damn it, It is hot!'
    else return 'IT IS MERIDA YUCATAN HOT!!!!'
}

const currentWeather = res =>{
    const { location , condition, temperature } = res
    return `The Weather is ${condition.green}. The temperature is ${String(temperature.degrees).red} ${temperature.unit.red}. ${getFeel(temperature.degrees)} `
}

const getDate = day =>{
    let dayStr = day.toLowerCase().trim();
    switch (dayStr) {
        case 'tomorrow':
            return moment().add(1, 'd').format('YYYY-MM-DD');
        case 'day after tomorrow':
            return moment().add(2, 'd').format('YYYY-MM-DD');
        default:
            return moment().format('YYYY-MM-DD');
    }
};

const forecastWeather = (res, data) =>{
    console.log('res', res);   
    let parseDate = getDate(data.time);
    const { city:location } = data
    console.log(location);
    
    // working here
    const { condition, temperature } = res.filter(i => i.date === parseDate)[0];
    let regEx = new RegExp(data.weather, 'i');
    let testCondition = regEx.test(condition);
    return `${testCondition ? 'Yes, there will' : 'No, there will not'} be ${condition} ${data.time} in ${location}`
}

module.exports = {
    currentWeather,
    forecastWeather
};