# CyRepo
 Don't look at old commits unless you're having a bad day.

# Notes
1. Packages in the database are stored by their bundleID ("name") and by their display name ("displayName"). There is a key titled version which will store each version of a package. **Note: periods in versions are replaced by | because of Mongo's weird dot notation.**
```json
{
    "name": "package.bundle.id",
    "displayName": "BundleID (iOS 2)",
    "version": {
        "1|0|0": { ... },
        "1|0|1": { ... }
    }
}
```
2. Ever since the new /r/jb bot, people are no longer searching for the exact name of packages ("Eclipse (iOS 13)" can be simplified to "Eclipse"). MongoDB provides no *real* solution to this, but a like query can be made using something along the lines of: 
```js
const results = await <Collection>.find({
    $or: [
        { name: /quanta/i }, // IE: ws.hbang.quanta
        { displayName: /quanta/i } // IE: Quanta (iOS 13)
    ]
}).toArray();
```
3. Average run times for me are well over a minute (~100 seconds): it has to download and decompress MBs of files, parse hundreds of thousands of lines of text, and then insert just about every line into a database. 
4. Please don't spam repos with requests. I recommend leaving an hour between runs.

![](./assets/db.png)

# How to use
Look at [start.js](./start.js) for example usage.
If you want to update packages frequently, use setInterval.

# External Dependencies
* MongoDB for storing package information.
* Node-fetch
* Seek-bzip for decoding bunzip files.

# Adding Repos
1. Get the URL of the Packages.bz2, Packages.gz, or Packages file (support for other methods coming when needed). Uncompressed data will be slowest; try avoiding it if there is an alternative!
2. Add into [repos.txt](./repos.txt).
3. Run.
