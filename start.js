const download = require('./src/download');
const parse = require('./src/parse');

(async () => {
    const bEnCHmArk = new Date().getTime();
    await download();
    await parse();
    console.log('Done in %d seconds.', (new Date().getTime() - bEnCHmArk) / 1000);
    process.exit();
})();