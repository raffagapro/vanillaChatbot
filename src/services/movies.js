'use strict';
const BotService = require('../models/BotService');

class MovieBot extends BotService {
    constructor(accessToken) {
        super(accessToken);
    }

    async processMessage(message) {
        try {
            const witResponse = await this.botClient.message(message, {});
            console.log('Wit.ai response:', JSON.stringify(witResponse, null, 2));
            const result = {
                intent: witResponse.intents?.[0]?.name || null,
                entities: witResponse.entities || {},
                text: message,
                witRaw: witResponse
            };

            let reply;
            switch (result.intent) {
                case 'getDirector':
                    reply = 'Entiendo que quieres saber sobre un director!';
                    break;
                case 'movieInfo':
                    reply = 'Entonces quieres información sobre una película!';
                    break;
                default:
                    reply = "No se de que vergas estas hablando!";
            }

            return { ...result, reply };
        } catch (error) {
            console.error('Wit.ai error:', error.message);
            return { error: 'Wit.ai processing failed.' };
        }
    }
}

module.exports = MovieBot