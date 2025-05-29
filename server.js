'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const FBeamer = require('./fbamer');

//Vanilla Weather Chatbot
const matcher = require('./matcher');
const weather = require('./weather');
const { cityParser } = require('./utils');
const { currentWeather, forecastWeather } = require('./parser');

const server = express();
const PORT = process.env.PORT || 3000;
const f = new FBeamer(process.env.FB_PAGE_ACCESS_TOKEN, process.env.VERIFY_TOKEN, process.env.FB_SECRET);

server.get('/', (req, res) => f.registerHook(req, res));

server.post('/', bodyParser.json({
    verify: f.verifySignature.call(f)
}));

server.post('/', (req, res, next)=>{
    return f.IncomingMessage(req, res, async data => {
        try {
            if (data.type === 'text') {
                matcher(data.content, async resp =>{
                    switch (resp.intent) {
                        case 'Hello':
                            await f.txt(data.sender, `${resp.entities.groups.greeting} to you too!`);
                            break;
                        case 'CurrentWeather':
                            await f.txt(data.sender, `Checking weather for ${cityParser(resp.entities.groups.city)}...`);
                            let cwData = await weather(resp.entities.groups);
                            let cwResult = currentWeather(cwData);
                            await f.txt(data.sender, cwResult);
                            break;
                        case 'WeatherForecast':
                            await f.txt(data.sender, `Checking forecast weather for ${(resp.entities.groups.city)}...`);
                            let fwData = await weather(resp.entities.groups);
                            let fwResult = forecastWeather(fwData, resp.entities.groups);
                            await f.txt(data.sender, fwResult);
                            break;
                        case 'EasterEgg':
                            await f.img(data.sender, 'https://i.imgflip.com/7bbx9t.jpg');
                            break;
                        default:
                            await f.txt(data.sender, 'Sorry, No habla ingles!');
                            break;
                    }
                });
            }

            // TO BE ERASED!!!
            if (data.content === 'Hello There!') {
                // await f.txt(data.sender, 'General Kenobi!');
                await f.img(data.sender, 'https://i.imgflip.com/7bbx9t.jpg');
            }
        } catch (err) {
            console.log(`Error processing incoming message: ${err.message}`);
        }
    });
});

server.listen(PORT, () => console.log(`Vanilla Weather Chatbot running on port:${PORT}`));
