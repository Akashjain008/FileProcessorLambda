const configJSON = require('./config.json');
class Config  {
    constructor() {
        this.setEnv = 'dev';
    }
    getConfig() {
        return configJSON[this.setEnv];
    }
};

module.exports = new Config();