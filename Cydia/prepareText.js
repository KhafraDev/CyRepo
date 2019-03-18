const fs = require('fs');

const prepareText = () => {
    return new Promise(resolve => {
        const data = fs.readFileSync('./decoded').toString('utf8')
        const splitByPackage = data.trim().split(/\n\n/g);
        // now splits into separate packages
        const packages = splitByPackage.map((e, i) => {
            const tempObject = {};
            tempObject[i] = e.split(/\n/g);
            //a.push(obj);
            return tempObject;
        }); 
        
        const p = packages.map((e, i) => {
            const tempObject = {};
            const t = e[i].map((ele) => {
                tempObject[ele.split(': ')[0]] = ele.split(': ')[1];
                return tempObject;
            });
            const testObj = {};
            const name = t.filter(e => e['Package'])[0].Package; // not all people put Package first
            //tempObject[name] = t[0];
            testObj[name] = { name: tempObject }
            return testObj;
        });
        return resolve(p);
    });
}

module.exports = prepareText;