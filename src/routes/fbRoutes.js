const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const fbController = require('../controllers/fbController');

const fb = new fbController({
    fbPageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN,
    verifyToken: process.env.VERIFY_TOKEN,
    fbSecret: process.env.FB_SECRET
});

router.get('/', fb.registerHook);

router.use(bodyParser.json({verify: fb.verifySignature}));

router.post('/', fb.receivedMessage);

module.exports = router;