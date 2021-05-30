const quickHttpd = require('./src/QuickHttpd.js');
const config = require('./config.json');
qh = new quickHttpd(config);

qh.start();