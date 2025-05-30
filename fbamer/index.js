'use strict';
const crypto = require('crypto');
const request = require('request');
const FB_API_VERSION = 'v22.0';

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
    };

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
    };

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

    // subscribe() {
    //         request({
    //             uri: 'https://graph.facebook.com/v2.8/me/subscribed_apps',
    //             qs: {
    //                 access_token: this.PAGE_ACCESS_TOKEN
    //             },
    //             method: 'POST'
    //         }, (error, response, body) => {
    //             if(!error && JSON.parse(body).success) {
    //                 console.log("Subscribed to the page!");
    //             } else {
    //                 console.log(error);
    //             }
    //         });
    // }

    subscribeNLP(){
        request({
            uri: `https://graph.facebook.com/${FB_API_VERSION}/me/nlp_configs`,
            qs: { 
                nlp_enabled: true,
                model: 'SPANISH',
                access_token: this.fbPageAccessToken,
                custom_token: 'YVBP4ZF5HHD3SOH3RMITBMEJQSB3B74A'
            },
            method: 'POST'
        }, (err, res, body) => {
            if (!err && JSON.parse(body).success) {
                console.log("Subscribed to the page!");
            } else {
                console.log(err);
            }
        });
    }

    incomingMessage(req, res, cb) {
        res.sendStatus(200);
        if (req.body.object === 'page' && req.body.entry) {
            let data = req.body;
            data.entry.forEach(pageObj =>{
                if (pageObj.messaging) {
                    pageObj.messaging.forEach(messageObj =>{
                        if (messageObj.postback) {
                            //hanlde postback
                        } else {
                            return cb(this.messageHandler(messageObj));
                        }
                    });
                }
            }); 
        }
    };

    messageHandler(obj){
        let sender = obj.sender.id;
        let message = obj.message

        if (message.text) return{
            sender,
            type: 'text',
            message
        }
    };

    sendMessage(payload){
        return new Promise((resolve, reject) => {
            request({
                uri:`https://graph.facebook.com/${FB_API_VERSION}/me/messages`,
                qs: { access_token: this.fbPageAccessToken },
                method: 'POST',
                json: payload
            }, (err, res, body) => {
                if (!err && res.statusCode === 200) resolve({ mid: body.message_id });
                else reject(err);            
            });
        });
    };

    txt(id, text, messaging_type = 'RESPONSE') {
        let payload = {
            messaging_type,
            recipient: { id },
            message: { text },
        };
        return this.sendMessage(payload);
    };

    img(id, url, messaging_type = 'RESPONSE'){
        let payload = {
            messaging_type,
            recipient: { id },
            message: {
                attachment: {
                    type: 'image',
                    payload: { url}
                }
            },
        };
        return this.sendMessage(payload);
    };
};

module.exports = FBeamer;