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