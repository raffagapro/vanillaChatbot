'use strict';
const { Wit } = require('node-wit');

class BotService {
    constructor(accessToken) {
        this.botClient = new Wit({ accessToken });
    }

    async processMessage(message) {
        throw new Error('processMessage() must be implemented by subclass or instance');
    }
}

module.exports = BotService;