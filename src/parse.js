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

        // remove duplicate lines and split each into package into its own chunk
        const data = [...new Set(readFileSync(join(__dirname, '../temp/', file))
            .toString()
            .trim()
            .split(/\n\n|\r\n\r\n/g) // thanks Akusio
        )];
        
        /** Array of packages split by line */
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
            if(!(o.Package.trim() in pkg)) {
                Object.defineProperty(pkg, o.Package.trim(), { value: {}, enumerable: true });
            }

            // this is Eclipse iOS 11's fault.
            if(o.Package.trim() in pkg && !(o.Version.trim() in pkg[o.Package.trim()])) {
                Object.defineProperty(pkg[o.Package.trim()], o.Version.trim(), { 
                    value: o, 
                    enumerable: true 
                });
            }
        }

        for(const v of Object.values(pkg)) {
            for(const version of Object.values(v)) {
                const r = await db.updateOne(
                    { name: `${version.Package}`, displayName: `${version.Name || version.Package}`},
                    { $set: { [`version.${version.Version.replace(/\./g, '|')}`]: version } },
                    { upsert: true }
                );
            
                if(r.result.ok !== 1) {
                    console.log('An error occured on this package:', k, v);
                    process.exit();
                }
            }
        }
    }
}

module.exports = parse;