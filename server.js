'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const FBeamer = require('./fbamer');

const server = express();
const PORT = process.env.PORT || 3000;
const f = new FBeamer(process.env.FB_PAGE_ACCESS_TOKEN, process.env.VERIFY_TOKEN, process.env.FB_SECRET);

server.get('/', (req, res) => f.registerHook(req, res));

server.post('/', bodyParser.json({
    verify: f.verifySignature.call(f)
}));

server.post('/', (req, res, next)=>{
    return f.IncomingMessage(req, res);
});

server.listen(PORT, () => console.log(`Vanilla Weather Chatbot running on port:${PORT}`));
