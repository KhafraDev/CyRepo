const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const { MongoClient } = require('mongodb');

/**
 * Parse Package list text into json readable language.
 */
const parse = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017/', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = client.db('cyrepo').collection('packages');

    for(const file of readdirSync(join(__dirname, '../temp/'))) {
        if(!file.endsWith('.txt')) {
            continue;
        }

        const data = [...new Set(readFileSync(join(__dirname, '../temp/', file))
            .toString()
            .trim()
            .split(/\n\n/g))];
        
        /**
         * Array of packages split by line
         */
        const packages = data.map(e => e.split(/\n/g));

        const pkg = {};
        for(const p of packages) {
            const o = {};
            for(const line of p) {
                const [k, v] = line.split(': ');
                if(!k || !v || (k in o)) { // thanks Saurik
                    continue;
                }

                Object.defineProperty(o, k, {
                    value: v,
                    enumerable: true
                });
            }

            // if the property does not exist, create it
            if(!(o.Package in pkg)) {
                Object.defineProperty(pkg, o.Package, { value: {}, enumerable: true });
            }

            // this is Eclipse iOS 11's fault.
            if(o.Package in pkg && !(o.Version in pkg[o.Package])) {
                Object.defineProperty(pkg[o.Package], o.Version, { value: o, enumerable: true });
            }
        }

        for(const [k, v] of Object.entries(pkg)) {
            const key = k.replace(/\./g, '-');
            const r = await db.updateOne(
                { [`${key}`]: { $exists: true } }, 
                { $set: { [`${key}`]: v } }, 
                { upsert: true }
            );
            

            if(r.result.ok !== 1) {
                console.log(k, v);
                process.exit();
            }
        }
    }
}

module.exports = parse;