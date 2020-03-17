const download = require('./src/download');
const parse = require('./src/parse');

(async () => {
    await download();
    await parse();
    console.log('Done!');
    process.exit();
})();