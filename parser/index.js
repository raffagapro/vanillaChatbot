'use strict'
const colors = require('colors');

const getFeel = temp =>{
    if (temp < 5) return 'It is shivering cold!';
    else if (temp >= 5 && temp < 15) return 'It is kinda chilly!'
    else if (temp >= 15 && temp < 25) return 'It is cool as a cucumber'
    else if (temp >= 25 && temp < 32) return 'It is quite warm'
    else if (temp >= 32 && temp < 40) return 'Damn it is hot!'
    else return 'IT IS MERIDA YUCATAN HOT!!!!'
}

const currentWeather = res =>{
    const { location , condition, temperature } = res
    return `The Weather is ${condition.green}. The temperature is ${String(temperature.degrees).red} ${temperature.unit.red}. ${getFeel(temperature.degrees)} `
}

module.exports = {
    currentWeather
};