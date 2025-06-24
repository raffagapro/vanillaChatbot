'use strict';
const axios = require('axios');
const Beamer = require('../models/Beamer');
const { normalizePhoneNumber } = require('../utils/phoneUtils');

class WABeamer extends Beamer {
    constructor({vToken, botService}){
        super(botService);
        if (!vToken) throw new Error('WA Required Tokens are missing!');
        this.vToken = vToken;
        this.senderNumber = null; 
    };

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

    receivedMessage = async (req, res) => {    
        try {
            const value = req.body?.entry?.[0]?.changes?.[0]?.value;
            const recivedMessage = value?.messages?.[0];
            if (recivedMessage) {
                this.senderNumber = normalizePhoneNumber(recivedMessage.from);
                const response = await this.botService.processMessage(recivedMessage.text.body);
                this.txt(response.reply);
            }
            res.status(200).send(`Message received!`);
        } catch (err) {
            console.log(`Error in receivedMessage: ${err.message}`);
            res.status(200).send();
        }   
    };

    txt(message){
        if (this.senderNumber && message) {
            return this.sendMessage(
                 `https://graph.facebook.com/${process.env.WA_API_VER}/${process.env.WA_BOT_NUMBER}/messages`,
                {
                    messaging_product: 'whatsapp',
                    recipient_type: "individual",
                    to: this.senderNumber,
                    type: 'text',
                    text: {
                        preview_url: "false",
                        body: message
                    }
                },
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.WA_TOKEN}`
                }
            );
        } else {
            throw new Error('senderNumber has not been set.');
        }
        
    };
} 

module.exports = WABeamer;