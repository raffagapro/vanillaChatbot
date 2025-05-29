'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const FBeamer = require('./fbamer');

const server = express();
const PORT = process.env.PORT || 3000;
const f = new FBeamer(process.env.FB_PAGE_ACCESS_TOKEN, process.env.VERIFY_TOKEN, process.env.FB_SECRET);

server.get('/', (req, res, next) => {
    f.registerHook(req, res)
    return next();
});

server.post('/', bodyParser.json({
    verify: f.verifySignature.call(f)
}));

server.post('/', (req, res, next)=>{
    return f.incomingMessage(req, res, async data => {
        try {
            if (data.type === 'text'){
                //Process messages
                const { message, sender } = data;
                if (message.text) {
                    // If a text message is received, use f.txt or f.img to send text/image back.
                    f.txt(sender, `You just said ${message.text}`);
                }
            }
        } catch (err) {
            console.log(`Error processing incoming message: ${err.message}`);
        }
    });
});

// f.subscribe();

server.listen(PORT, () => console.log(`Chatbot running on port:${PORT}`));
