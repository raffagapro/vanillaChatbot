const express = require('express');
const router = express.Router();
const WABeamer = require('../controllers/waControllers');
const MovieBot = require('../services/movies')

const wa = new WABeamer({
    vToken: process.env.VERIFY_TOKEN,
    botService: new MovieBot(process.env.WIT_AI_TOKEN)
});

router.get('/', wa.verifyToken);
router.post('/', wa.receivedMessage);

module.exports = router;