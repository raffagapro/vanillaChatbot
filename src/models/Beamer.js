'use strict';
const axios = require('axios');

class Beamer {
    constructor(botService) {
        if (new.target === Beamer) {
            throw new TypeError("Cannot construct BeamerBase instances directly");
        }
        this.botService = botService;
    }

    async sendMessage(url, payload, headers, params) {
        try {
            const response = await axios.post(
                url,
                payload,
                {
                    headers,
                    params
                }
            );
            return response.data;
        } catch (err) {
            console.error('Error status:', err.response?.status);
            console.error('Error data:', JSON.stringify(err.response?.data, null, 2));
        }
    }

    txt() {
        throw new Error('txt() must be implemented by subclass');
    }
}

module.exports = Beamer;