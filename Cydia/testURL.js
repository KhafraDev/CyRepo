const fetch = require('node-fetch');
const validator = require('validator'); // used for validating URLS (testURL)
const AbortController = require('abort-controller'); // used for timing out requests (testURL)

const testURL = url => {
    const controller = new AbortController();

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => { 
            return reject(controller.abort()); 
        }, 1000);
        const isURL = validator.isURL(url, { protocols: ['http','https'], require_tld: true, require_protocol: true, disallow_auth: true });
        if(!isURL) return reject(new Error('Not a valid URL!'));

        fetch(url, { signal: controller.signal })
            .then(res => { // adapted from https://github.com/bitinn/node-fetch
                return resolve(res);
            }, err => {
                return reject(err);
            }).finally(() => {
                return clearTimeout(timeout);
            });
    });
}

module.exports = testURL;