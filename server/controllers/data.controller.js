const httpStatus = require('http-status')
const DataService = require('../services/data.service')
var log = require('log4js').getLogger(`data ctl`);

// The class DataCtl is using the class DataService
class DataCtl {
  constructor() {
    this.service = new DataService();
  }

  ///////////// DB
    /**
     * getDB2Infos
     * 
    */
     async getDB2Infos() {
      log.trace(`[db2Ctl.getDB2Infos] started...`)
      try {
        const result = await this.service.getDB2Infos()
        log.trace(`[db2Ctl.getDB2Infos] completed`)
        return { err: null, db_infos: result.response }
      } catch (e) {
        log.error(`Error : ${e.name} ${e.message}`)
        return { err: (e.name?e.name:`unknown`), message: (e.message?e.message:`unknown`) }
      }
    }
  
    /**
     * getDepartments
     * 
    */
     async getDepartments() {
      log.trace(`[db2Ctl.getDepartments] started...`)
      try {
        const result = await this.service.getDepartments()
        log.trace(`[db2Ctl.getDepartments] completed`)
        return { err: null, departments: result.response }
      } catch (e) {
        log.error(`Error : ${e.name} ${e.message}`)
        return { err: (e.name?e.name:`unknown`), message: (e.message?e.message:`unknown`) }
      }
    }

    /**
     * getEmployees
     * 
    */
    async getEmployees() {
      log.trace(`[db2Ctl.getEmployees] started...`)
      try {
        const result = await this.service.getEmployees()
        log.trace(`[db2Ctl.getEmployees] completed`)
        return { err: null, employees: result.response }
      } catch (e) {
        log.error(`Error : ${e.name} ${e.message}`)
        return { err: (e.name?e.name:`unknown`), message: (e.message?e.message:`unknown`) }
      }
    }
  
  /**
    * insertEmployee
    * 
  */
   async insertEmployee(employee_def) {
    log.trace(`[db2Ctl.insertEmployee] started...`)
    try {
      const result = await this.service.insertEmployee(employee_def)
      log.trace(`[insertEmployee] completed`)
      return result
    } catch (e) {
      log.error(`Error : ${e.name} ${e.message}`)
      return { err: (e.name?e.name:`unknown`), message: (e.message?e.message:`unknown`) }
    }
  }


  /**
    * updateEmployeeLevel
    * 
  */
   async updateEmployeeLevel(employee_level) {
    log.trace(`[db2Ctl.updateEmployeeLevel] started...`)
    try {
      const result = await this.service.updateEmployeeLevel(employee_level)
      log.trace(`[updateEmployeeLevel] completed`)
      return result
    } catch (e) {
      log.error(`Error : ${e.name} ${e.message}`)
      return { err: (e.name?e.name:`unknown`), message: (e.message?e.message:`unknown`) }
    }
  }

  /**
    * deleteEmployee
    * 
  */
   async deleteEmployee(empno) {
    log.trace(`[db2Ctl.deleteEmployee] started...`)
    try {
      const result = await this.service.deleteEmployee(empno)
      log.trace(`[deleteEmployee] completed`)
      return result
    } catch (e) {
      log.error(`Error : ${e.name} ${e.message}`)
      return { err: (e.name?e.name:`unknown`), message: (e.message?e.message:`unknown`) }
    }
  }

}
module.exports = DataCtl
