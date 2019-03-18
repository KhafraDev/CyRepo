const fetch = require('node-fetch');
const fs = require('fs');
const Bunzip = require('seek-bzip'); // used for decoding .bz2 files into buffers
const findRepoFromURL = require('./findRepoFromURL');

const downloadBz2 = url => {
    return new Promise(async (resolve, reject) => {
        const isRepo = await findRepoFromURL(url).catch(() => {});

        if(!isRepo || !isRepo.url || isRepo.err) {
            return reject({ err: new Error('Not a valid repo URL!') });
        }

        fetch(isRepo.url)
            .then(async res => {
                const dest = await fs.createWriteStream('./encoded.bz2');
                res.body.pipe(dest)
                    .on('error', err => { return reject(err); })
                    .on('finish', async () => {
                        try { // if buffer isn't valid, it won't crash (thanks bigboss)...
                            const data = await Bunzip.decode(fs.readFileSync('./encoded.bz2'));
                            await fs.writeFileSync('decoded', data);
                            return resolve(data);
                        } catch(err) {
                            return reject(err);
                        }
                    });
            }).catch(err => {
                return reject(err);
            });
    })
}

module.exports = downloadBz2;