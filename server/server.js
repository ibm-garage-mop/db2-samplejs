const http = require('http')
const https = require('https')
const express = require('express')
const httpStatus = require('http-status')

const fs = require('fs');


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv')
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv()

// retrieve app name and versin from package.json
const appName = require('./../package').name
const appVersion = require('./../package').version

// variables used when server is running in local (port, etc...) 
const localConfig = require('./config/local.json')
// retrieve env variables (environment-agnostic) see: https://www.npmjs.com/package/ibm-cloud-env
// list of variables and locations are defined in server/config/mapping.json 
var IBMCloudEnv = require('ibm-cloud-env')
IBMCloudEnv.init()

const app = express()
//const server = http.createServer(app)

// work around intermediate CA issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


// Log4js https://www.npmjs.com/package/log4js doc for additional details (send logs to several destination, etc..)
const log4js = require('log4js')
// middleware logger for express logs (http)
const expresslogger = log4js.getLogger(`${appName} ${appVersion} HTTP`)
app.use(log4js.connectLogger(expresslogger, { level: 'auto' }))
// logger used for application logs
const logger = log4js.getLogger(`server`)

// type of messages logged according to loglevel
// level    messagetype 
// trace => trace, debug, info, warn, error, fatal
// debug => debug, info, warn, error, fatal
// info => info, warn, error, fatal
// warn => warn, error, fatal
// error => error, fatal
// fatal => fatal
// Exemple: if loglevel = warn, then only logger.warn, logger.error and logger.fatal messages are logged

// configure log4js to define a log level for default, express and application
// default log level
let categories = {default: { appenders: [ 'everything' ], level: IBMCloudEnv.getString('appLogLevel') || 'info' }}
// express expressloger log level 
categories[`${appName} ${appVersion} HTTP`] = { appenders: ['everything'], level: IBMCloudEnv.getString('httpLogLevel') || 'error' }

// log are sent to sdtout
log4js.configure({
  appenders: {
    everything: { type: 'stdout' }
  },
  categories: categories
})




// set services (for cloudant)
const serviceManager = require('./services/service-manager');

// set server session
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'db2DemoMOPApp', resave: true, saveUninitialized: true }));
app.use(express.json());  //(for json body)

let server = {}
let secure_server = {}
// run in https if local
if (appEnv.isLocal) {
	// start http and https server on localhost
  secure_server = https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
      }, app)
  server = http.createServer(app)
}

//Enable reverse proxy support in Express. This causes the
//the "X-Forwarded-Proto" header field to be trusted so its
//value can be used to determine the protocol. See 
//http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy')

app.use (function (req, res, next) {
  if (req.secure) {
    //console.log('request is https')
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    if(!appEnv.isLocal) {
      console.log('request is http not in local, redirect to: https://' + req.headers.host + req.url)
      res.redirect('https://' + req.headers.host + req.url)
    }else{
      let https_port = localConfig.secure_port
      let host_domain = req.headers.host.split(":")[0];
      console.log(" request is http in local.. try to redirect to: https://"+host_domain+':'+https_port+ req.url);
      res.redirect('https://'+host_domain+':'+https_port+ req.url);
    }
  }
});



// set API routes
require('./routers/index')(app, appName, appVersion)

/// catch page not found 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(`the url ${req.url} does not exists`)
  err.status = httpStatus.NOT_FOUND
  next(err)
})

/// error handler
app.use(function(err, req, res, next) {
  console.error("Something went wrong:", JSON.stringify(err))
  res
  .status(err.status || 500)
  .json({error: (err.status?'Error' +err.status:'Error unknown'), message: err.message || 'No message available'})
  .end()  
})


if (appEnv.isLocal) {
	// start server and secure_server on localhost
  server.listen(localConfig.port, function(){
    logger.info(`Application ${appName} Version: ${appVersion} started on http localhost port ${localConfig.port} ...`)
  })
  secure_server.listen(localConfig.secure_port, function(){
    logger.info(`Application ${appName} Version: ${appVersion} started on https localhost port ${localConfig.secure_port} ...`)
  })
} else {
	// start server on IBM Cloud
	app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    logger.info(`Application ${appName} Version: ${appVersion} started...`)
	})
}


