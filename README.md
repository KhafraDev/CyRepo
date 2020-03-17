# CyRepo
 Don't look at old commits unless you're having a bad day.

# Note
* Packages are stored by their bundle ID

# How to use
Look at [start.js](./start.js) for example usage.
If you want to update packages frequently, use setInterval.

# Dependencies
* MongoDB for storing package information.
* Node-fetch
* Seek-bzip for decoding bunzip files.

# Adding Repos
1. Get the URL of the Packages.bz2 file.
2. Add into [repos.txt](./repos.txt).
3. Run.
