'use strict';
require('dotenv').config();
const express = require('express');

//WHATSAAP
const waRouter = require('./routes/waRoutes');

//FACEBOOK
const fbRouter = require('./routes/fbRoutes');

const server = express();
const PORT = process.env.PORT || 3000;
server.use(express.json());

server.use('/wa', waRouter);
server.use('/fb', fbRouter);

server.listen(PORT, () => console.log(`Chatbot running on port:${PORT}`));
