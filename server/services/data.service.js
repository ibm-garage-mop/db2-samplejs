//const util = require('util')
const IBMCloudEnv = require('ibm-cloud-env')

const ibmdb = require('ibm_db');
let db2_connection = {}
try {
	db2_connection = JSON.parse(IBMCloudEnv.getString('db2_connection'))
} catch(e) {
  console.error('db2_connection credentials is an invalid json object.. '+e)
}
const db2ConnStr = `DATABASE=${db2_connection.database};HOSTNAME=${db2_connection.hostname};UID=${db2_connection.uid};PWD=${db2_connection.pwd};PORT=${db2_connection.port};PROTOCOL=TCPIP`;


var log = require('log4js').getLogger(`data.service`)

class DataService {

  /////////////////////////////////////////////////////////////
  // DB2 ()
  /////////////////////////////////////////////////////////////

  // EMPLOYEE TABLE
  /*
  $ db2 describe table DB2INST1.EMPLOYEE
                                Data type                     Column
Column name                     schema    Data type name      Length     Scale Nulls
------------------------------- --------- ------------------- ---------- ----- ------
EMPNO                           SYSIBM    CHARACTER                    6     0 No
FIRSTNME                        SYSIBM    VARCHAR                     12     0 No
MIDINIT                         SYSIBM    CHARACTER                    1     0 Yes
LASTNAME                        SYSIBM    VARCHAR                     15     0 No
WORKDEPT                        SYSIBM    CHARACTER                    3     0 Yes
PHONENO                         SYSIBM    CHARACTER                    4     0 Yes
HIREDATE                        SYSIBM    DATE                         4     0 Yes
JOB                             SYSIBM    CHARACTER                    8     0 Yes
EDLEVEL                         SYSIBM    SMALLINT                     2     0 No
SEX                             SYSIBM    CHARACTER                    1     0 Yes
BIRTHDATE                       SYSIBM    DATE                         4     0 Yes
SALARY                          SYSIBM    DECIMAL                      9     2 Yes
BONUS                           SYSIBM    DECIMAL                      9     2 Yes
COMM                            SYSIBM    DECIMAL                      9     2 Yes
  14 record(s) selected.
  */

  // this method is used to retrieve the list of employees
  async getEmployees() {
    // open db2 connection
    let db2conn
    try {
      log.trace(`[db2.service.getEmployees] try to connect to db2...`)
      db2conn = await ibmdb.open(db2ConnStr)
    } catch(err) {
      console.error('[db2.service.getEmployees] ', JSON.stringify(err))
      return { err: 'DB_ERROR', message: 'Cannot connect to the Database!!!' }         
    }
    try {
      let sql_query = `select * from DB2INST1.EMPLOYEE order by empno`
      let data = await db2conn.query(sql_query)
      db2conn.closeSync();
      log.trace(`[db2.service.getEmployees] db2 connection closed`)
      let resp_json={ err: null }
      resp_json.response = []
      if(data.length>0){
        resp_json.response = data
      }
      return resp_json
    } catch(err) {
      db2conn.closeSync();
      console.error('[db2.service.getEmployees] ', JSON.stringify(err))
      return { err: 'DB_ERROR', message: 'Error querying employee data' }         
    }
  }


  // this method is used to insert a new employee record in EMPLOYEE table
  async insertEmployee(employee_def) {
    //console.log(employee_def)
    // TODO check each part of the employee_def json object
    // if checkl_employee_def(employee_def) {}
    // else {  
    //   return { err: 'DB_ERROR', message: 'Invalid input fields' }
    // }
    /*
    {
      empno: '1376',
      firstnme: 'Benoit',
      lastname: 'Clerget',
      edlevel: 3
    }
    */
    // Check input params
    if(isNaN(parseInt(employee_def.edlevel))) {
      // if edlevel not a number, throw err
      let err = new Error('Input argument edlevel must be a valid integer number !!!')
      err.name = `insertEmployee.invalidInputData`
      throw err
    }
    // open db2 connection
    let db2conn
    try {
      log.trace(`[db2.service.insertEmployee] try to connect to db2...`)
      db2conn = await ibmdb.open(db2ConnStr)
    } catch(err) {
      console.error('[db2.service.insertEmployee] ', JSON.stringify(err))
      return { err: 'DB_ERROR', message: 'Cannot connect to the Database!!!' }         
    }
    let sql_flow_step = ''
    try {
      sql_flow_step = 'sql verif'
      // check that empno does not already exists
      // the ibm_db currently does not raise an sql error if empno already exist
      // so we need to add a first query to check if it does not exists, then we can run the insert 
      let sql_query = `select empno from DB2INST1.EMPLOYEE where empno='${employee_def.empno}'`
      let data = await db2conn.query(sql_query)
      if(data.length > 0) {
        db2conn.closeSync();
        console.error(`[db2.service.insertEmployee] employee ${employee_def.empno} already exists`)
        return { err: 'EXIST_OR_NOTAUTH', message: `employee ${employee_def.empno} already exists` }
      }
      sql_flow_step = 'insert employee'
      sql_query = `insert into DB2INST1.EMPLOYEE (empno,firstnme,lastname,edlevel)
          values('${employee_def.empno}','${employee_def.firstnme}','${employee_def.lastname}',${parseInt(employee_def.edlevel)})
          where not exists (select * from DB2INST1.EMPLOYEE where empno = '${employee_def.empno}')`
      data = await db2conn.query(sql_query)
      db2conn.closeSync();
      log.trace(`[db2.service.insertEmployee] db2 connection closed`)
      return { err: null, message: `empoyee ${employee_def.empno} (${employee_def.firstnme} ${employee_def.lastname}) successfully added in database`}
    } catch(err) {
      db2conn.closeSync();
      console.error('[db2.service.insertEmployee] ' + sql_flow_step, JSON.stringify(err))
      return { err: 'DB_ERROR', message: 'Error inserting employee data. Step: ' + sql_flow_step } 
    }
  }
  

  // this method is used to update the dlevel of an existing employee
  async updateEmployeeLevel(employee_level) {
    // Check input params
    if(isNaN(parseInt(employee_level.new_level))) {
      // if new_level not a number, throw err
      let err = new Error('Input argument new_level must be a valid integer number !!!')
      err.name = `updateEmployeeLevel.invalidInputData`
      throw err
    }
    // open db2 connection
    let db2conn
    try {
      log.trace(`[db2.service.updateEmployeeLevel] try to connect to db2...`)
      db2conn = await ibmdb.open(db2ConnStr)
    } catch(err) {
      console.error('[db2.service.updateEmployeeLevel] ', JSON.stringify(err))
      return { err: 'DB_ERROR', message: 'Cannot connect to the Database!!!' }         
    }
    let sql_flow_step = ''
    try {
      sql_flow_step = 'sql verif'
      // check that empno exists
      // the ibm_db currently does not raise an sql error if empno does not exists  TODO to be confirmed
      // so we need to add a first query to check if it does exist, then we can run the update 
      let sql_query = `select empno from DB2INST1.EMPLOYEE where empno='${employee_level.empno}'`
      let data = await db2conn.query(sql_query)
      if(data.length < 1) {
        db2conn.closeSync();
        console.error(`[db2.service.updateEmployeeLevel] employee ${employee_level.empno} does not exist`)
        return { err: 'NOT_EXIST_OR_NOTAUTH', message: `employee ${employee_level.empno} does not exist` }
      }
      sql_flow_step = 'update employee with new edlevel'
      sql_query = `update DB2INST1.EMPLOYEE set edlevel=${parseInt(employee_level.new_level)}
        where empno='${empno}'`
      data = await db2conn.query(sql_query)
      db2conn.closeSync();
      log.trace(`[db2.service.updateEmployeeLevel] db2 connection closed`)
      return { err: null, message: `employee ${employee_level.empno} edlevel successfully updated with new value: ${employee_level.new_level}`}
    } catch(err) {
      db2conn.closeSync();
      console.error('[db2.service.updateEmployeeLevel] ' + sql_flow_step, JSON.stringify(err))
      return { err: 'DB_ERROR', message: 'Error updating empolyee edlevel. Step: ' + sql_flow_step } 
    }
  }

  ////// END DB2 //////  


}

module.exports = DataService