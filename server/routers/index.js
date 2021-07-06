module.exports = function(app, appName, appVersion){
    // public routes
    require('./html')(app)
    require('./health')(app, appName, appVersion)
    // api routes
    require('./apis')(app, appName, appVersion)
}
