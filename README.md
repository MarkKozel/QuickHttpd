# Quick HTTPD

Simple HTTPD web servers that delivers html, css, jpg/ico, and scripts from local files

## Requires:
- Node 14.x, maybe earlier

## Dependancies
- [quickjsonconfig 1.1.4](https://github.com/MarkKozel/quickjsonconfig)
## Usage:

### Create Web Content Files
Suggested you put all web files in a single folder

Example ```www``` folder contains:

  * index.html - Main web page
  * image folder - contains all images and favicon
  * libs folder - contains 3rd party libraries, such as JQuery and Bootstrap
  * scripts folder - contain and custom javascript files
  
  Ensure index.html has correct relative pathing to elements in ```www``` folder(s)

### Create config.json file
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
const quickHttpd = require('./src/QuickHttpd.js');
const config = require('./config.json');
qh = new quickHttpd(config);

qh.start();
```

Open web broswer on same machine (or on same local network)
Enter ```http://192.168.1.9:8080```


## License:
[CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
Attribution-NonCommercial-ShareAlike 4.0 International

## Miscellany

### Near Future to-dos
None

### Version History

0.1.0 - Initial buildup for side project. Implementing minimal elements

<a href="https://www.buymeacoffee.com/MarkKozel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" height="41" width="174"></a>


### Historical Context
The global pandemic is ending, the US federal government is more stable, and it is summer