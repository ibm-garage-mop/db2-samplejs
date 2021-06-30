// public health API used to verify that the dbm web app is up
var express = require('express')
// retrieve app name and version from package.json
var log = require('log4js').getLogger(`health`)

module.exports = function(app, appName, appVersion) {
  var router = express.Router()

  router.get('/health', function (req, res, next) {
    log.trace('/health called...')
    res.json({status: 'UP', name: appName, version: appVersion, dirname: __dirname})
    //res.json({status: 'UP', name: appName, version: appVersion, dirname: 'not provided'})
  })

  app.use(router)
}



