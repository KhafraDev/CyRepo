const testURL = require('./testURL');

const findRepoFromURL = async url => {
    return new Promise(async (resolve, reject) => {
        const testPackagesBZ2 = await testURL(`${url}/Packages.bz2`).catch(() => {});
        const testDists = await testURL(`${url}/dists/ios/1443.00/main/binary-iphoneos-arm/`).catch(() => {});
        // errors are handled below
        if(!testPackagesBZ2 || !testDists) { // domain doesn't exist (same domain is checked twice)
            return reject({ err: new Error('Invalid domain') });
        } else if(testPackagesBZ2.status !== 200 && testDists.status !== 200) { // domain isn't a valid repo
            return reject({ err: new Error('Not a valid repo.') });
        } else if(testPackagesBZ2.status === 200) { // url/Packages.bz2 is valid
            return resolve({ url: `${url}/Packages.bz2` });
        } else if(testDists.status === 200) { // url/dists/ios/1443.00/main/binary-iphoneos-arm/ exists (default repos only?)
            return resolve({ url: `${url}/dists/ios/1443.00/main/binary-iphoneos-arm/Packages.bz2` });
        } 
        return reject({ err: 'I didn\'t make it'});
    });
}

module.exports = findRepoFromURL;