# Quick HTTPD

Simple HTTPD web servers that delivers html, css, jpg/ico, and scripts from local files

## Requires:
- Node 14.x, maybe earlier

## Dependancies
- none

## Install and Setup:
Create a node project in a folder with ```npm init -y```

### Install Package
```bash
npm install --save quickhttpd
```

### Create Web Content Files (WWWRoot)
Suggested you put all web files in a single folder

*Sample ```www``` folder can be found at ```node_modules/quickhttpd/www```*

Example ```www``` folder contains:

  * index.html - Main web page (DefaultPage)
  * image folder - contains all images and favicon
  * libs folder - contains 3rd party libraries, such as JQuery and Bootstrap
  * scripts folder - contain and custom javascript files
  
  Ensure index.html has correct relative pathing to elements in ```www``` folder(s)

### Create config.js file

Config fiel contains standard elements, like hostname and port

It also contains required and optional function used by QuickHttpd to allow customization

The example config file, ```node_modules/quickhttpd/config.js``` contains default/simple examples of each function in the ```Functions``` block
* Function under the ```//Function expected in Httpd``` block must exist and be defined
* Function under the ```//Lifecycle Hooks (optional)``` block are optional. Omitting 1 or more will not (should not) cause errors
* Function under the ```//Support function used by expected/optional function``` block are user-defined code that is called in the other 2 blocks

> Function in the config.Function block will all be expressed as **QuickHttpd** class members. As such, ```this.``` is required when calling any of these functions
>
>See ```Function.logInfo(msg)``` call to ```this.timestamp()``` defined in ```//Support function used by expected/optional function``` block

```javascript
module.exports = {
  Hostname: '192.168.1.9',
  Port: 8080,
  WWWRoot: 'www',
  DefaultPage: 'index.html',
  Functions: {
    //Function expected in Httpd
    logInfo(msg) {
      console.info(`${this.timestamp()}: ${msg}`);
    },

    logError(msg) {
      console.error(`${this.timestamp()}: ${msg}`);
    },

    shutdownServer() {
      console.log('');
      this.logInfo("Shuting Down");
      this.httpdServer.close();
      this.httpdServer = null;
      process.exit();
    },

    //Lifecycle Hooks (optional)
    logEvent(msg) {
      console.log(`Event: ${this.timestamp()}: ${msg}`);
    },

    postCreate() {
      console.info(`QuickHttpd created. Config loaded and Functions expressed\n`);
    },

    preStart() {
      console.info(`Starting Httpd Server...`);
    },

    postStart(httpdServer) {
      console.info(`Server started. Server Keep Alive Timeout ${httpdServer.keepAliveTimeout}\n`);
    },

    preRequest(request, response) {
      console.info(`New Request Rec'd. Request Method ${request.method}. Request URL: ${request.url}`);
    },

    postRequest(response, content) {
      console.info(`New Request Processed. Status Code: ${response.statusCode}. Sent ${content.length} bytes\n`);
    },

    //Support function used by expected/optional function
    timestamp() {
      return (new Date()).toISOString().replace(/z|t/gi, ' ').trim();
    },
  }
}
```

### Create a start.js file
```javascript
const quickHttpd = require('../src/QuickHttpd.js');
const config = require('../config.js');
qh = new quickHttpd(config);

qh.start();
```

### Start the Server

```bash 
node start.js
2021-05-30 03:24:56.803: HTML Server is running on http://192.168.1.9:8080
```

### Start the Web Broswer
Open web broswer on same machine (or on same local network)

Enter ```http://192.168.1.9:8080```

In the server's terminal window you should see several request log messages as elements are requested from the browser

The below outbut is based on default config.Functions. Changing

```bash
QuickHttpd created. Config loaded and Functions expressed

Starting Httpd Server...
Server started. Server Keep Alive Timeout 5000

2021-05-31 17:12:53.782: HTTPD Server is running on http://192.168.1.9:8080

New Request Rec'd. Request Method GET. Request URL: /
Event: 2021-05-31 17:12:56.139: Document Request Complete
New Request Processed. Status Code: 200. Sent 2680 bytes

New Request Rec'd. Request Method GET. Request URL: /libs/bootstrap/css/bootstrap.min.css
Event: 2021-05-31 17:12:56.253: Style Request Complete
New Request Processed. Status Code: 200. Sent 144877 bytes

New Request Rec'd. Request Method GET. Request URL: /style.css
Event: 2021-05-31 17:12:56.257: Style Request Complete
New Request Processed. Status Code: 200. Sent 719 bytes

New Request Rec'd. Request Method GET. Request URL: /libs/jquery-3.5.1.min.js
Event: 2021-05-31 17:12:56.266: Script Request Complete
New Request Processed. Status Code: 200. Sent 107745 bytes

New Request Rec'd. Request Method GET. Request URL: /libs/popper-1.12.9_umd.min.js
Event: 2021-05-31 17:12:56.274: Script Request Complete
New Request Processed. Status Code: 200. Sent 19187 bytes

New Request Rec'd. Request Method GET. Request URL: /libs/bootstrap/js/bootstrap.min.js
Event: 2021-05-31 17:12:56.281: Script Request Complete
New Request Processed. Status Code: 200. Sent 48944 bytes

New Request Rec'd. Request Method GET. Request URL: /scripts/textcolor.js
Event: 2021-05-31 17:12:56.287: Script Request Complete
New Request Processed. Status Code: 200. Sent 111 bytes

New Request Rec'd. Request Method GET. Request URL: /images/rover_drop.jpg
Event: 2021-05-31 17:12:56.609: Image Request Complete
New Request Processed. Status Code: 200. Sent 2537340 bytes

New Request Rec'd. Request Method GET. Request URL: /images/NASA_perseverance.jpg
Event: 2021-05-31 17:12:56.611: Image Request Complete
New Request Processed. Status Code: 200. Sent 10238 bytes

New Request Rec'd. Request Method GET. Request URL: /images/favicon.ico
Event: 2021-05-31 17:12:56.953: Image Request Complete
New Request Processed. Status Code: 200. Sent 1150 bytes

^C
2021-05-31 17:12:58.697: Shuting Down
```

### Terminate the Server
```CTRL + C``` is received on non-windows systems as SIGTERM or SIGINT. This is captured by the Server and Shutdown is initiated

## License:
[CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
Attribution-NonCommercial-ShareAlike 4.0 International

## Miscellany

### Near Future to-dos
None

### Version History
0.2.0 - Removed .json config. Implemented ```config.js```. Added configurable logging/shutdown, lifecycle hooks, and custom functions

0.1.5 - Initial buildup for side project. Implementing minimal elements

<a href="https://www.buymeacoffee.com/MarkKozel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" height="41" width="174"></a>


### Historical Context
The global pandemic is ending, the US federal government is more stable, and it is summer