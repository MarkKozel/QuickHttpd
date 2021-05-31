const quickHttpd = require('../src/QuickHttpd.js');
const config = require('../config.js');
qh = new quickHttpd(config);

qh.start();