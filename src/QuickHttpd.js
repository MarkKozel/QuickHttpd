const http = require("http");
const fs = require('fs');
const path = require('path');

class QuickHttpd {
  constructor(config) {
    if (!config) {
      return null;
    }

    this.config = config;

    this.httpdServer = null;

    process.on('SIGTERM', () => {
      if (this.httpdServer) {
        this.shutdownServer();
      }
    });

    process.on('SIGINT', () => {
      if (this.httpdServer) {
        this.shutdownServer();
      }
    });

    process.on('exit', () => {
      if (this.httpdServer) {
        this.shutdownServer();
      }
    });

    //Express config functions
    for (const func in this.config.Functions) {
      this[func] = this.config.Functions[func];
    }

    if (typeof this.postCreate === 'function') {
      this.postCreate();
    }
  }

  start() {
    if (typeof this.preStart === 'function') {
      this.preStart();
    }

    this.httpdServer = http.createServer();

    this.httpdServer.on('request', (request, response) => {
      switch (request.method) {
        case "GET":
          this.handleGet(request, response);
          break;

        default:
          this.logError(`Don't know what to do with ${request.method}\n`);
      }
    });

    this.httpdServer.listen(this.config.Port, this.config.Hostname, () => {
      if (this.httpdServer) {
        this.logInfo(`HTTPD Server is running on http://${this.config.Hostname}:${this.config.Port}\n`);
      } else {
        this.logError(`Error: Failed to create HTTPD Server on http://${this.config.Hostname}:${this.config.Port}\n`)
      };
    });

    if (typeof this.postStart === 'function') {
      this.postStart(this.httpdServer);
    }
  }

  handleGet(request, response) {
    if (typeof this.preRequest === 'function') {
      this.preRequest(request, response);
    }

    const { url } = request;

    let filePath = url;
    if (url === '/') {
      filePath = this.config.DefaultPage;
    }
    let fileName = path.join(this.config.WWWRoot, filePath);
    if (!fs.existsSync(fileName)) { return; }


    let content = fs.readFileSync(fileName);
    if (content.length > 0) {
      let eventMsg = '';
      let ext = path.extname(filePath);
      switch (ext) {
        case ('.html'):
          response.setHeader("Content-Type", "text/html");
          eventMsg = `Document Request Complete`;
          break;
        case ('.jpg'):
        case ('.ico'):
          response.setHeader('Content-Type', 'image/x-icon');
          eventMsg = `Image Request Complete`;
          break;
        case ('.css'):
          response.setHeader('Content-Type', 'text/css');
          eventMsg = `Style Request Complete`;
          break;
        case ('.js'):
          response.setHeader('Content-Type', 'text/javascript');
          eventMsg = `Script Request Complete`;
          break;
        case ('.map'):
          response.setHeader('Content-Type', 'application/json');
          eventMsg = `SourceMap Request Complete`;
          break;
        default:
          eventMsg = `hit default case with ext = ${ext}`;
          return;
      }

      if (typeof this.logEvent === 'function') {
        this.logEvent(eventMsg);
      }
    } else {
      response.setHeader("Content-Type", "text/html");
      response.writeHead(404);
      content = `<html> <body><h5>Unknown route</h5></body></html > `;
      this.logInfo(`Unable to parse ${url} header...404 error returned`);
    }

    response.writeHead(200);
    response.end(content);

    if (typeof this.postRequest === 'function') {
      this.postRequest(response, content);
    }
  }
}



module.exports = QuickHttpd;