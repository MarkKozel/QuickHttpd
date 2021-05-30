const QuickJsonConfig = require('quickjsonconfig').QuickJsonConfig;
const http = require("http");
const fs = require('fs');
const path = require('path');
const url = require('url').URL;

class QuickHttpd {
  constructor(config) {
    this.config = new QuickJsonConfig(config);
    this.HOST = this.config.getHostname();
    this.PORT = this.config.getPort();
    this.WEBPATH = this.config.getWWWRoot();
    this.DEFAULTPAGE = this.config.getDefaultPage();

    this.httpdServer = null;
  }

  start() {
    this.httpdServer = http.createServer();

    this.httpdServer.on('request', (request, response) => {
      switch (request.method) {
        case "GET":
          this.handleGet(request, response);
          break;

        default:
          console.error(`Don't know what to do with ${request.method}`)
      }
    });

    this.httpdServer.listen(this.PORT, this.HOST, () => {
      if (this.httpdServer) {
        this.logMessage(`HTML Server is running on http://${this.HOST}:${this.PORT}`);
      } else {
        console.error(`Error: Failed to createHTML Server on http://${this.HOST}:${this.PORT}`)
      };
    });
  }

  handleGet(request, response) {
    const { url } = request;

    let filePath = url;
    if (url === '/') {
      filePath = this.DEFAULTPAGE;
    }
    let fileName = path.join(this.WEBPATH, filePath);
    if (!fs.existsSync(fileName)) { return; }

    let content = fs.readFileSync(fileName);
    if (content.length > 0) {
      let ext = path.extname(filePath);
      switch (ext) {
        case ('.html'):
          response.setHeader("Content-Type", "text/html");
          this.logMessage(`Document Request Complete`);
          break;
        case ('.jpg'):
        case ('.ico'):
          response.setHeader('Content-Type', 'image/x-icon');
          this.logMessage(`Image Request Complete`);
          break;
        case ('.css'):
          response.setHeader('Content-Type', 'text/css');
          this.logMessage(`Style Request Complete`);
          break;
        case ('.js'):
          response.setHeader('Content-Type', 'text/javascript');
          this.logMessage(`Script Request Complete`);
          break;
        case ('.map'):
          response.setHeader('Content-Type', 'application/json');
          this.logMessage(`SourceMap Request Complete`);
          break;
        default:
          this.logMessage(`hit default case with ext = ${ext}`);
          return;
      }
    } else {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(404);
      content = `<html> <body><h5>Unknown route</h5></body></html > `;
      this.logMessage(`Unable to parse ${url} header...404 error returned`);
    }

    response.writeHead(200);
    response.end(content);
  }

  logMessage(msg) {
    console.log(`${this.timestamp()}: ${msg}`);
  }

  //Helper function to create a timestamp
  timestamp() {
    return (new Date)
      .toISOString()
      .replace(/z|t/gi, ' ')
      .trim()
  };


  //   shutdown() {
  //     this.logMessage("Shuting Down");
  //     httpdServer.close();
  //     process.exit();
  //   }

  //   process.on('SIGTERM', () => {
  //     shutdown();
  //   });

  // process.on('SIGINT', () => {
  //   shutdown();
  // });

  // process.on('exit', () => {
  //   shutdown();
  // });
}








module.exports = QuickHttpd;