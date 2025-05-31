const bodyParser = require('body-parser');
const FBeamer = require('../fbamer');
const f = new FBeamer(process.env.FB_PAGE_ACCESS_TOKEN, process.env.VERIFY_TOKEN, process.env.FB_SECRET);

const registerHook = (req, res, next) => {
    f.registerHook(req, res)
    return next();
}

const verifySignature = bodyParser.json({
    verify: f.verifySignature.call(f)
})

const incomingMessage = (req, res, next)=>{
    return f.incomingMessage(req, res, async data => {
        try {
            if (data.type === 'text'){
                //Process messages
                const { message, sender } = data;
                if (message.text) {
                    // If a text message is received, use f.txt or f.img to send text/image back.
                    f.txt(sender, `You just said ${message.text}`);
                    console.log(message.nlp);
                    
                }
            }
        } catch (err) {
            console.log(`Error processing incoming message: ${err.message}`);
        }
    });
}

module.exports = {
    registerHook,
    verifySignature,
    incomingMessage
};