// public routes used to retrieve icon, images and other public items
var express = require('express')
const path = require('path')
module.exports = function(app){
  var router = express.Router()
  router.get('/favicon.ico', function (req, res, next) {
    var options = {
      root: path.join(__dirname, '../../public'),
    }
    res.sendFile('favicon.ico', options, function (err) {
      if (err) {
        console.error('Error sending favicon.ico: ', err)
        next(err)
      }
    })
  })

  //app.use('/html', express.static("./public/html"))
  app.use(router)
}