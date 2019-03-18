# CyRepo

Quickly gather info on valid Cydia repos!

# Basic Usage
```js
const cydia = require('cyrepo');
cydia.downloadBz2('https://khafradev.github.io/')
    .then(() => repo.prepareText())
    .then(console.log)
    .catch(console.error)
```
- Invalid repos will be caught
- Invalid domains will be caught
- All[^1] errors should be caught
- Uses external library to validate URLs
[^1]: all errors that I have seen with my API and S0n1c_Dev's

# Other info
- Supports promises
- completely asynchronous
- Dependencies: node-fetch, validator, seek-bzip, abort-controller and fs
- test: `node test.js`

# Credits
1. [S0n1c_Dev](https://twitter.com/S0n1c_Dev/) : Original API/idea
2. [Khafra](https://twitter.com/Tombs) : Code
