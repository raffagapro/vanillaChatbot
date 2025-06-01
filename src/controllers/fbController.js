'use strict';
const crypto = require('crypto');
const axios = require('axios');

class FBeamer {
    constructor({fbPageAccessToken, verifyToken, fbSecret}) {        
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

    messageObject;

    registerHook = (req, res, next) => {
        const params = req.query;
        const mode = params['hub.mode'],
              token = params['hub.verify_token'],
              challenge = params['hub.challenge'];
        try {
            if ((mode && token) && (mode === 'subscribe' && token === this.verifyToken)) {
                console.log('Webhook registered!');
                res.send(challenge);
            } else {
                console.log('Could not register webhook!');
                res.sendStatus(200);
            }
            return next();
        } catch (e) {
            console.log(`Error in registerHook: ${e.message}`);
        }
    };

    verifySignature = (req, res, buf) => {
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
    };

    receivedMessage = (req, res) => {
        try {
            if (req.body.object === 'page' && req.body.entry) {
                let data = req.body;
                data.entry.forEach(pageObj =>{
                    if (pageObj.messaging) {
                        pageObj.messaging.forEach(messageObj =>{
                            if (messageObj.postback) {
                                //hanlde postback
                            } else if (messageObj.message && !messageObj.message?.is_echo) {
                                this.messageObject = this.setMessageObj(messageObj);
                                // Only call txt if message.text exists
                                if (
                                    this.messageObject && 
                                    this.messageObject.type === 'text' && 
                                    this.messageObject.message &&
                                    this.messageObject.message.text
                                ) {
                                    this.txt(this.messageObject.sender, `You just said: ${this.messageObject.message.text}`);
                                }
                            }
                        });
                    }
                }); 
            }
            res.status(200).send(`Message received!`);
        } catch (err) {
            console.log(`Error in receivedMessage: ${err.message}`);
            res.status(200).send();
        }
    };

    sendMessage = async (payload) =>{
        try {
            const response = await axios.post(
                `https://graph.facebook.com/${process.env.FB_API_VER}/me/messages`,
                payload,
                {
                    params: { access_token: this.fbPageAccessToken },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Error status:', err.response.status);
            console.error('Error data:', JSON.stringify(err.response.data, null, 2));
        }
    };

    txt(id, text, messaging_type = 'RESPONSE') {
        let payload = {
            messaging_type,
            recipient: { id },
            message: { text },
        };
        return this.sendMessage(payload);
    };

    setMessageObj = (obj) =>{
        let sender = obj.sender.id;
        let message = obj.message

        if (message.text) return{
            sender,
            type: 'text',
            message
        }
        console.log(`Unsupported or missing message type from sender ${sender}`);
        return null;
    };
}

module.exports = FBeamer;