# Quick HTTPD

Simple HTTPD web servers that delivers html, css, jpg/ico, and scripts from local files

## Requires:
- Node 14.x, maybe earlier

## Dependancies
- [quickjsonconfig 1.1.4](https://github.com/MarkKozel/quickjsonconfig)
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

### Create config.json file
*example ```config``` file  can be found at ```node_modules/quickhttpd/config.json```*
```json
{
  "Hostname": "192.168.1.9",
  "Port": "8080",
  "WWWRoot": "www",
  "DefaultPage": "index.html"
}
```

> Make sure Hostname (Ip Address) is correct
>
> Ensure ```Port``` is open on host firewall/router

### Create a start.js file
```javascript
const QuickHttpd = require('quickhttpd').QuickHttpd;
const config = require('./config.json');
qh = new QuickHttpd(config);

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

```bash
2021-05-30 03:25:01.768: Document Request Complete
2021-05-30 03:25:01.815: Style Request Complete
2021-05-30 03:25:01.823: Style Request Complete
2021-05-30 03:25:01.832: Script Request Complete
2021-05-30 03:25:01.836: Script Request Complete
2021-05-30 03:25:01.841: Script Request Complete
2021-05-30 03:25:01.847: Script Request Complete
2021-05-30 03:25:01.907: Image Request Complete
2021-05-30 03:25:01.918: Image Request Complete
2021-05-30 03:25:02.113: Image Request Complete
```

## License:
[CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
Attribution-NonCommercial-ShareAlike 4.0 International

## Miscellany

### Near Future to-dos
None

### Version History

0.1.5 - Initial buildup for side project. Implementing minimal elements

<a href="https://www.buymeacoffee.com/MarkKozel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" height="41" width="174"></a>


### Historical Context
The global pandemic is ending, the US federal government is more stable, and it is summer