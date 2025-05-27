'use strict';
const patterns = require('../patterns');
const XregExp = require('xregexp');

let createEntities = (str, patter) =>{
    return XregExp.exec(str, XregExp(patter, 'i'));
}

let matcherPattern = (str, cb) =>{
    let getResult = patterns.find(item => {
        if(XregExp.test(str, XregExp(item.pattern, 'i'))) {
            return true;
        }
    });

    if (getResult) {
        return cb({
            intent: getResult.intent,
            entities: createEntities(str, getResult.pattern)
        });
    } else {
        return cb({});
    }
}

module.exports = matcherPattern