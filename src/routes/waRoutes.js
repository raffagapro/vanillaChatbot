const express = require('express');
const router = express.Router();
const waController = require('../controllers/waControllers');

const wa = new waController(process.env.VERIFY_TOKEN);

router.get('/', wa.verifyToken);
router.post('/', wa.receivedMessage);

module.exports = router;