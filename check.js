const fs = require('fs');
const lockfile = JSON.parse(fs.readFileSync('d:/FRONTIER ATLASSS/FrontierAtlas/package-lock.json', 'utf8'));
const hasLinux = Object.keys(lockfile.packages).some(p => p.includes('@img/sharp-linux-x64'));
console.log('Has @img/sharp-linux-x64:', hasLinux);
