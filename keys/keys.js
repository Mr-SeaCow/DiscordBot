const devKeys = require('./keys.dev');
const prodKeys = require('./keys.prod');
const os = require('os');

if (os.platform() !== 'win32') {
    module.exports = devKeys;
    
} else {
    module.exports = prodKeys;
}