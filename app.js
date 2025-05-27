'use strict';
require('dotenv').config();
const Readline = require('readline');
const matcher = require('./matcher');
const weather = require('./weather');
const { cityParser } = require('./utils');
const { currentWeather, forecastWeather } = require('./parser');


const rl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.setPrompt('> ');
rl.prompt();
rl.on('line', replay =>{
    matcher(replay, data =>{
        switch (data.intent) {
            case 'Hello':
                console.log(`${data.entities.groups.greeting} to you too!`);
                rl.prompt();
                break;

            case 'CurrentWeather':
                console.log(`Checking weather for ${cityParser(data.entities.groups.city)}...`);
                weather(data.entities.groups)
                    .then(res => console.log(currentWeather(res)))
                    .catch(err => console.error(`Error fetching weather: ${err.message}`));
                rl.prompt();
                break;

            case 'WeatherForecast':
                console.log(`Checking forecast weather for ${(data.entities.groups.city)}`);
                weather(data.entities.groups)
                    .then(res => console.log(forecastWeather(res, data.entities.groups)))
                    .catch(err => console.error(`Error fetching weather: ${err.message}`));
                rl.prompt();
                break;

            case 'Exit':
                console.log("Goodbye from Vanilla!");
                process.exit(0);
                break;
        
            default:
                console.log("Sorry, I don't understand that.");
                rl.prompt();
                break;
        }
    });
})