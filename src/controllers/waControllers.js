'use strict';
const axios = require('axios');

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
            console.log(req.body.entry[0].changes[0].value.messages[0]);
            const recivedMessage = req.body.entry[0].changes[0].value.messages[0]
            if (recivedMessage) this.senderNumber = recivedMessage.from;
            res.send(`Message received!`);
            this.txt(`You just said: ${recivedMessage.text.body}`);
        } catch (err) {
            console.log(`Error in receivedMessage: ${err.message}`);
            res.status(400).send();
        }   
    };

    sendMessage = async (body) => {
        console.log(process.env.WA_API_VER);
        console.log(this.senderNumber);
        console.log(process.env.WA_TOKEN);
        
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
            console.log(`Error sending message: ${err.message}`);
        }
    };

    txt(message){
        console.log(message);
        
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