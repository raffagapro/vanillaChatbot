'use strict';
const crypto = require('crypto');

class FBeamer{
    constructor(fbPageAccessToken, verifyToken, fbSecret){
        try {
            if (fbPageAccessToken && verifyToken && fbSecret) {
                this.fbPageAccessToken = fbPageAccessToken;
                this.verifyToken = verifyToken;
                this.fbSecret = fbSecret;
            }else {
                throw new Error('Facebook Page Access Token and/or Verify Token are missing!');
            }
        } catch (e) {
            console.log(`Error initializing FBeamer: ${e.message}`);
        }
    }

    registerHook(req, res) {
        const params = req.query;
        const mode = params['hub.mode'],
              token = params['hub.verify_token'],
              challenge = params['hub.challenge'];
        
        try {
            if ((mode && token) && (mode === 'subscribe' && token === this.verifyToken)) {
                console.log('Webhook registered!');
                return res.send(challenge);
            } else {
                console.log('Could not register webhook!');
                return res.sendStatus(200);
            }
        } catch (e) {
            console.log(`Error in registerHook: ${e.message}`);
        }
    }

    verifySignature(req, res, buf) {
        return (req, res, buf)=>{
            if (req.method === 'POST') {
                try {
                    let signature = req.headers['x-hub-signature'];
                    if (!signature) throw new Error('Signature not found in headers');
                    else {
                        let hash = crypto.createHmac('sha1', this.fbSecret).update(buf, 'utf-8');
                        if (hash.digest('hex') !== signature.split('=')[1]) { //sha1=2938472938742983749283
                            throw new Error('Invalid signature');
                        }
                    }
                } catch (e) {
                    console.log(`Error in verifySignature: ${e.message}`);
                }
            }
        }
    };
    IncomingMessage(req, res) {
        res.sendStatus(200);
        if (req.body.object === 'page' && req.body.entry) {
            let data = req.body;
            data.entry.forEach(pageObj =>{
                if (pageObj.messaging) {
                    pageObj.messaging.forEach(messageObj =>{
                        console.log(messageObj);
                        if (messageObj.postback) {
                            //hanlde postback
                        } else {
                            // handle message
                        }
                    });
                }
            }); 
        }
    }
};

module.exports = FBeamer;