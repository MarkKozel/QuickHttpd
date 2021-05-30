// const WebSocket = require('ws');
const QuickJsonConfig = require('quickjsonconfig').QuickJsonConfig;
const http = require("http");
const fs = require('fs');
const path = require('path');
const url = require('url').URL;



config = new QuickJsonConfig(path.join(__dirname, 'qhsConfig.json'));
const HOST = config.getHostname();
const PORT = config.getPort();
const WEBPATH = config.getWWWRoot();
const DEFAULTPAGE = config.getDefaultPage()

function shutdown() {
  httpdServer.close();
  process.exit();
}

process.on('SIGTERM', () => {
  shutdown();
});

process.on('SIGINT', () => {
  shutdown();
});

process.on('exit', () => {
  shutdown();
});

const httpdServer = http.createServer();

httpdServer.on('request', (request, response) => {
  // let newURL = new URL(`http://${request.headers.host}${request.url}`)

  const { method } = request;
  switch (method) {
    case "GET":
      handleGet(request, response);
      break;

    default:
      console.error(`Don't know what to do with ${request.method}`)
  }
});

httpdServer.listen(PORT, HOST, () => {
  if (httpdServer) {
    logMessage(`HTML Server is running on http://${HOST}:${PORT}`);
  } else {
    console.error(`Error: Failed to createHTML Server on http://${HOST}:${PORT}`)
  };
});


//Returns URL params -or- false if none were present
// function checkParams(request) {
//   let result = false;
//   const obj = url.parse(request.url, true).query;
//   if ((Object.keys(obj).length !== 0) && (obj.constructor !== Object)) {
//     result = obj;
//   }
//   return result;
// }

function handleGet(request, response) {
  const { url } = request;

  let filePath = url;
  if (url === '/') {
    filePath = DEFAULTPAGE;
  }
  let fileName = path.join(WEBPATH, filePath);
  if (!fs.existsSync(fileName)) { return; }

  let content = fs.readFileSync(fileName);
  if (content.length > 0) {
    let ext = path.extname(filePath);
    switch (ext) {
      case ('.html'):
        response.setHeader("Content-Type", "text/html");
        logMessage(`Document Request Complete`);
        break;
      case ('.jpg'):
      case ('.ico'):
        response.setHeader('Content-Type', 'image/x-icon');
        logMessage(`Image Request Complete`);
        break;
      case ('.css'):
        response.setHeader('Content-Type', 'text/css');
        logMessage(`Style Request Complete`);
        break;
      case ('.js'):
        response.setHeader('Content-Type', 'text/javascript');
        logMessage(`Script Request Complete`);
        break;
      case ('.map'):
        response.setHeader('Content-Type', 'application/json');
        logMessage(`SourceMap Request Complete`);
        break;
      default:
        logMessage(`hit default case with ext = ${ext}`);
        return;
    }
  } else {
    response.setHeader("Content-Type", "text/html");
    response.writeHead(404);
    content = `<html> <body><h5>Unknown route</h5></body></html > `;
    logMessage(`Unable to parse ${url} header...404 error returned`);
  }

  response.writeHead(200);
  response.end(content);
}

function logMessage(msg) {
  console.log(`${timestamp()}: ${msg}`);
}

//Helper function to create a timestamp
function timestamp() {
  return (new Date)
    .toISOString()
    .replace(/z|t/gi, ' ')
    .trim()
};