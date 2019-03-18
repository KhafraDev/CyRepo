const repo = require('./Cydia');

// invalid/nonexistent urls will throw errors
// or if it's bigboss since it's special
repo.downloadBz2('https://khafradev.github.io/')
    .then(() => repo.prepareText())
    .then(console.log)
    .catch(console.error)
