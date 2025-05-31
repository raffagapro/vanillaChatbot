'use strict';
const axios = require('axios');
const { normalizePhoneNumber } = require('../utils/phoneUtils');

class WABeamer{
    constructor(vToken){
        try {
            if (vToken) {
                this.vToken = vToken;
            } else throw new Error('WA Required Tokens are missing!');
        } catch (err) {
            console.log(`Error initializing WABeamer: ${err.message}`);
        }
    };
    senderNumber;

    verifyToken = (req, res) => {
        try {
            const token = req.query['hub.verify_token'];
            const challenge = req.query['hub.challenge'];
            if (challenge && token && token === this.vToken) {
                console.log('Webhook registered!');
                res.status(200).send(challenge);
            } else res.status(400).send();
        } catch (err) {
            console.log(`Error in verifyToken: ${err.message}`);
            res.status(400).send();
        }
    };

    receivedMessage = (req, res) => {    
        try {
            const value = req.body?.entry?.[0]?.changes?.[0]?.value;
            const recivedMessage = value?.messages?.[0];
            if (recivedMessage) {
                this.senderNumber = normalizePhoneNumber(recivedMessage.from);
                this.txt(`You just said: ${recivedMessage.text.body}`);
            }
            res.status(200).send(`Message received!`);
        } catch (err) {
            console.log(`Error in receivedMessage: ${err.message}`);
            res.status(200).send();
        }   
    };

    sendMessage = async (body) => {
        try {
            const response = await axios.post(
                `https://graph.facebook.com/${process.env.WA_API_VER}/${process.env.WA_BOT_NUMBER}/messages`,
                body,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.WA_TOKEN}`
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Error status:', err.response.status);
            console.error('Error data:', JSON.stringify(err.response.data, null, 2));
        }
    };

    txt(message){
        if (this.senderNumber && message) {
            return this.sendMessage({
                messaging_product: 'whatsapp',
                recipient_type: "individual",
                to: this.senderNumber,
                type: 'text',
                text: {
                    preview_url: "false",
                    body: message
                }
            });
        } else {
            throw new Error('senderNumber has not been set.');
        }
        
    };
} 

module.exports = WABeamer;