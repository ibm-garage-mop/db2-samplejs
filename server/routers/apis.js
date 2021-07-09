// dbm web app private routes
const util = require('util')
//const fs = require('fs')
const os = require('os')
const exec = util.promisify(require('child_process').exec)
const express = require('express')
const httpStatus = require('http-status')
const DataController = require('../controllers/data.controller')

module.exports = function(app, appName, appVersion) {
  const router = express.Router()

  // system infos
  router.get('/api/system_infos', async function(req, res) {
    let result = {
      err: null,
      db_infos: {},
      system: {
        arch: os.arch(),
        cpus: os.cpus(),
        endianness: os.endianness(),
        freemem: os.freemem(),
        hostname: os.hostname(),
        platform: os.platform(),
        totalmem: os.totalmem(),
        type: os.type(),
        version: os.version(),
        os_name: '?',
        os_version: '?',
        docker: false,
        kubepods: false,
      },
      web_app: {
        name: appName,
        version: appVersion,
        dirname: __dirname
      }
    }
    // get nodejs version
    try {
      const { stdout, stderr } = await exec('node -v');
      result.web_app.node_js = stderr&stderr!=''?'':stdout
    } catch(e) {
      result.web_app.node_js = '?'
    }
    // get system os name from cat /etc/os-release
    try{
      // get os Name 
      const { stdout, stderr } = await exec("cat /etc/os-release | grep ^NAME=")
      result.system.os_name = stderr&stderr!=''?'':stdout.split('=')[1]
    } catch(e){
      console.error(`Error trying to get os name`)
    }
    // get system os version from cat /etc/os-release
    try{
      // get os Version 
      const { stdout, stderr } = await exec("cat /etc/os-release | grep ^VERSION=")
      result.system.os_version = stderr&stderr!=''?'':stdout.split('=')[1]
    } catch(e){
      console.error(`Error trying to get os version`)
    }
    
    // get docker info 
    try{
      const { stdout, stderr } = await exec("cat /proc/self/cgroup |grep /docker")
      result.system.docker_self_cgroup = stderr&stderr!=''?'':stdout
      if(result.system.docker_self_cgroup!='') {
        result.system.docker = true
      }
    } catch(e){
      result.system.docker_self_cgroup = ''  // assuming that if the file is not present then this is not a docker container... 
    }
    // get kubernetes infos
    try{
      const { stdout, stderr } = await exec("cat /proc/self/cgroup |grep /kubepods")
      result.system.kubepods_self_cgroup = stderr&stderr!=''?'':stdout
      if(result.system.kubepods_self_cgroup!='') {
        result.system.kubepods = true
      }
    } catch(e){
      result.system.kubepods_self_cgroup = ''  // assuming that if the file is not present then this is not a docker container... 
    }
    
    // get DB infos
    const dataCtl = new DataController()
    let db_res = await dataCtl.getDB2Infos()
    result.db_infos = db_res.db_infos
    res
    .status(httpStatus.OK)
    .json(result)
    .end()
  })

  // DEPARTMENTS
  router.get('/api/departments', async function(req, res) {
    const dataCtl = new DataController()
    let result = await dataCtl.getDepartments()
    if(result.err) {
      res.status(httpStatus.BAD_REQUEST).json(result).end()
    } else {
      res
      .status(httpStatus.OK)
      .json(result)
      .end()
    }
  })

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

