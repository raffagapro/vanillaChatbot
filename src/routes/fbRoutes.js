const express = require('express');
const router = express.Router();
const {
    registerHook,
    verifySignature,
    incomingMessage
} = require('../controllers/fbController');

router.get('/', registerHook);

router.post('/', verifySignature);

router.post('/', incomingMessage);

module.exports = router;