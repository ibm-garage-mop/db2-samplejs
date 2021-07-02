// dbm web app private routes
//const util = require('util')
const fs = require('fs')
const express = require('express')
const httpStatus = require('http-status')
const DataController = require('../controllers/data.controller')

module.exports = function(app) {
  const router = express.Router()

  // EMPLOYEES
  router.get('/api/employees', async function(req, res) {
    const dataCtl = new DataController()
    let result = await dataCtl.getEmployees()
    if(result.err) {
      res.status(httpStatus.BAD_REQUEST).json(result).end()
    } else {
      res
      .status(httpStatus.OK)
      .json(result)
      .end()
    }
  })

  // create employee record
  router.post('/api/employee', async function(req, res) {
    //console.log(req.body); // employee_def json
    const dataCtl = new DataController()
    let result = await dataCtl.insertEmployee(req.body)
    if(result.err && result.err != 'EXIST_OR_NOTAUTH') {
      res.status(httpStatus.BAD_REQUEST).json(result).end()
    } else {
      res
      .status(httpStatus.OK)
      .json(result)
      .end()
    }
  })
  
  // update employee edlevel
  router.post('/api/employee_level', async function(req, res) {
    //console.log(req.body); // employee_level json
    const dataCtl = new DataController()
    let result = await dataCtl.updateEmployeeLevel(req.body)
    if(result.err && result.err != 'NOTEXIST_OR_NOTAUTH') {
      res.status(httpStatus.BAD_REQUEST).json(result).end()
    } else {
      res
      .status(httpStatus.OK)
      .json(result)
      .end()
    }
  })

  // delete employee entry
  router.delete('/api/employee/:empno', async function(req, res) {
    //console.log(req.body); // employee_level json
    const dataCtl = new DataController()
    let result = await dataCtl.deleteEmployee(req.params.empno)
    if(result.err && result.err != 'NOTEXIST_OR_NOTAUTH') {
      res.status(httpStatus.BAD_REQUEST).json(result).end()
    } else {
      res
      .status(httpStatus.OK)
      .json(result)
      .end()
    }
  })

  app.use('/', express.static("./dist"))
  app.use(router)
}

