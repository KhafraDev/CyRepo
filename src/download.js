const { readFileSync, writeFileSync, createWriteStream } = require('fs');
const { join } = require('path');
const { createGunzip } = require('zlib');

const fetch = require('node-fetch');
const { decode } = require('seek-bzip');

const repos = readFileSync(join(__dirname, '..', 'repos.txt')).toString().split('\n');

/**
 * Get required headers, if there are any.
 * @param {string} repo Repo URL 
 */
const headers = repo => {
    if(repo === 'https://repo.dynastic.co/Packages.bz2') {
        // why require easily spoofable headers?
        // especially if the values *aren't* checked!
        return {
            'X-Machine': 'iPhone10,2',
            'X-Firmware': '13.3',
            'X-Unique-ID': '69000000000000000000000000000'
        }
    } else {
        return {};
    }
}

/**
 * Download the list of packages from a given repo.
 */
const downloadList = async () => {
    for(const repo of repos.map(r => r.trim())) {
        try {
            const res = await fetch(repo, {
                headers: headers(repo)
            });

            if(repo.endsWith('.bz2')) {
                await new Promise((resolve, reject) => {
                    res.body.pipe(createWriteStream('./temp/encoded.bz2'))
                    .on('error', reject)
                    .on('finish', () => {
                        try { // nested try/catch, scoping issue I guess
                            const data = decode(readFileSync('./temp/encoded.bz2'));
                            writeFileSync(
                                `./temp/decoded-${new URL(repo).host}.txt`, 
                                data
                            );
                            return resolve();
                        } catch(err) {
                            return reject(err);
                        }
                    });
                });
            } else if(repo.endsWith('.gz')) {
                await new Promise((resolve, reject) => {
                    const buf = [];
                    res.body.pipe(createGunzip())
                        .on('error', reject)
                        .on('data', d => buf.push(d.toString()))
                        .on('end', () => resolve(writeFileSync(
                            `./temp/decoded-${new URL(repo).host}.txt`, 
                            buf.join('\n').trim()
                        )));
                });
            } else if(repo.endsWith('Packages')) {
                // thanks https://repo.conorthedev.me
                writeFileSync(
                    `./temp/decoded-${new URL(repo).host}.txt`, 
                    (await res.text()).trim()
                );
            }
        } catch(err) {
            console.error('An error occured parsing %s.\n', repo, err.message);
        }
    }

    return true;
}

module.exports = downloadList;