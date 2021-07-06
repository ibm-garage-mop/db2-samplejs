/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */


//const util = require('util')
// toaster
import { Notification } from 'carbon-components';
//const toastInstanceInfo =  Notification.create(document.getElementById('toast_info'));
//toastInstanceInfo.remove()
//toastInstanceInfo.release()

// request web app info api
async function getWebAppInfos() {
  if (window.fetch) {
    try{
      let response = await fetch('/health')
      if(response.ok) {
          let myJson = await response.json()
          return {err: false, web_infos: myJson}
      } else {
        console.error('response error: ' + response.ok);
        return {err: true, message: 'Error retrieving web app infos response'}
      }
  
    } catch(error) {
      console.error('Error with fetch operation: ' + error);
      return {err: true, message: 'Error retrieving web app infos response'}
    }
  } else {
    console.error('fetch not supported');
    return {err: true, message: 'fetch not supported'}
  }
}

// request system info api
async function getSystemInfos(resolve,reject) {
  if (window.fetch) {
    try{
      let response = await fetch('/api/system_infos')
      if(response.ok) {
        response.json().then(function(myJson) {
          if (!myJson.err) {
            resolve(myJson)
          } else {
            console.error('API error: ' + myJson.message);
            reject({err: true, message: myJson.message})
          }
        });
      } else {
        console.error('response error: ' + response.ok);
        reject({err: true, message: 'Error retrieving system_infos API response'})
      }
  
    } catch(error) {
      console.error('Error with fetch operation: ' + error);
      reject({err: true, message: 'unknownerror'})
    }
  } else {
    console.error('fetch not supported');
    reject({err: true, message: 'fetch not supported'})
  }
}

// request system info api
async function getTestSystemInfos(resolve,reject) {
  resolve(
{
  "err": null,
  "db_infos": {
    "sql_dbms_functionlvl": "s2106111000",
    "sql_dbms_name": "DB2/LINUXPPC64LE",
    "sql_dbms_ver": "11.05.0600",
    "sql_driver_bldlevel": "s2011011400",
    "sql_driver_name": "libdb2.a",
    "sql_driver_ver": "11.05.0500",
    "sql_odbc_ver": "03.01.0000",
    "sql_server_name": "DB2"
  },
  "system": {
    "arch": "x64",
    "cpus": [
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 161270,
          "nice": 1610,
          "sys": 42530,
          "idle": 2259780,
          "irq": 4790
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 176680,
          "nice": 2400,
          "sys": 42760,
          "idle": 2246710,
          "irq": 5980
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3899,
        "times": {
          "user": 172670,
          "nice": 2450,
          "sys": 48500,
          "idle": 2246500,
          "irq": 5280
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 187570,
          "nice": 610,
          "sys": 59440,
          "idle": 2224210,
          "irq": 5130
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 169730,
          "nice": 1160,
          "sys": 43120,
          "idle": 2258160,
          "irq": 4510
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 173090,
          "nice": 1350,
          "sys": 51290,
          "idle": 2242820,
          "irq": 6130
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 152300,
          "nice": 790,
          "sys": 40990,
          "idle": 2278310,
          "irq": 4490
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3901,
        "times": {
          "user": 154360,
          "nice": 780,
          "sys": 42550,
          "idle": 2274370,
          "irq": 4510
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3906,
        "times": {
          "user": 155160,
          "nice": 960,
          "sys": 54570,
          "idle": 2261360,
          "irq": 4840
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 155360,
          "nice": 810,
          "sys": 40350,
          "idle": 2275460,
          "irq": 5310
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 133640,
          "nice": 880,
          "sys": 68760,
          "idle": 2249130,
          "irq": 22070
        }
      },
      {
        "model": "Intel(R) Core(TM) i7-8850H CPU @ 2.60GHz",
        "speed": 3900,
        "times": {
          "user": 154080,
          "nice": 830,
          "sys": 46280,
          "idle": 2270500,
          "irq": 4500
        }
      }
    ],
    "endianness": "LE",
    "freemem": 14522871808,
    "hostname": "76fc53b90806",
    "platform": "linux",
    "totalmem": 33382400000,
    "type": "Linux",
    "version": "#1 SMP Thu Mar 25 14:36:04 EDT 2021",
    "docker": "Y"
  },
  "web_app": {
    "name": "db2-samplejs",
    "version": "1.0.2",
    "dirname": "/usr/src/app/server/routers",
    "node_js": "v14.17.1\n"
  }

})
}


// request employees api
async function getEmployees(resolve,reject) {
  if (window.fetch) {
    fetch('/api/employees').then(function(response) {
      if(response.ok) {
        response.json().then(function(myJson) {
          if (!myJson.err) {
            resolve(myJson)
          } else {
            console.error('API error: ' + myJson.message);
            reject({err: true, message: myJson.message})
          }
        });
      } else {
        console.error('response error: ' + response.ok);
        reject({err: true, message: 'Error retrieving employees API response'})
      }
    })
    .catch(function(error) {
      console.error('Error with fetch operation: ' + error);
      reject({err: true, message: 'unknownerror'})
    });
  } else {
    console.error('fetch not supported');
    reject({err: true, message: 'fetch not supported'})
  }
}

// request employees api test
async function getTestEmployees(resolve,reject) {
  resolve(
{
  "err": null,
  "employees": [
    {
      "EMPNO": "000010",
      "FIRSTNME": "CHRISTINE",
      "MIDINIT": "I",
      "LASTNAME": "HAAS",
      "WORKDEPT": "A00",
      "PHONENO": "3978",
      "HIREDATE": "1995-01-01",
      "JOB": "PRES    ",
      "EDLEVEL": 10,
      "SEX": "F",
      "BIRTHDATE": "1963-08-24",
      "SALARY": 152750,
      "BONUS": 1000,
      "COMM": 4220,
      "DEPTNAME": "SPIFFY COMPUTER SERVICE DIV."
    },
    {
      "EMPNO": "000012",
      "FIRSTNME": "Benoit",
      "MIDINIT": null,
      "LASTNAME": "Clerget",
      "WORKDEPT": "A00",
      "PHONENO": null,
      "HIREDATE": null,
      "JOB": null,
      "EDLEVEL": 100,
      "SEX": null,
      "BIRTHDATE": null,
      "SALARY": 45000,
      "BONUS": null,
      "COMM": null,
      "DEPTNAME": "SPIFFY COMPUTER SERVICE DIV."
    },
    {
      "EMPNO": "000020",
      "FIRSTNME": "MICHAEL",
      "MIDINIT": "L",
      "LASTNAME": "THOMPSON",
      "WORKDEPT": "B01",
      "PHONENO": "3476",
      "HIREDATE": "2003-10-10",
      "JOB": "MANAGER ",
      "EDLEVEL": 18,
      "SEX": "M",
      "BIRTHDATE": "1978-02-02",
      "SALARY": 94250,
      "BONUS": 800,
      "COMM": 3300,
      "DEPTNAME": "PLANNING"
    },
    {
      "EMPNO": "000030",
      "FIRSTNME": "SALLY",
      "MIDINIT": "A",
      "LASTNAME": "KWAN",
      "WORKDEPT": "C01",
      "PHONENO": "4738",
      "HIREDATE": "2005-04-05",
      "JOB": "MANAGER ",
      "EDLEVEL": 20,
      "SEX": "F",
      "BIRTHDATE": "1971-05-11",
      "SALARY": 98250,
      "BONUS": 800,
      "COMM": 3060,
      "DEPTNAME": "INFORMATION CENTER"
    },
    {
      "EMPNO": "000050",
      "FIRSTNME": "JOHN",
      "MIDINIT": "B",
      "LASTNAME": "GEYER",
      "WORKDEPT": "E01",
      "PHONENO": "6789",
      "HIREDATE": "1979-08-17",
      "JOB": "MANAGER ",
      "EDLEVEL": 16,
      "SEX": "M",
      "BIRTHDATE": "1955-09-15",
      "SALARY": 80175,
      "BONUS": 800,
      "COMM": 3214,
      "DEPTNAME": "SUPPORT SERVICES"
    },
    {
      "EMPNO": "000060",
      "FIRSTNME": "IRVING",
      "MIDINIT": "F",
      "LASTNAME": "STERN",
      "WORKDEPT": "D11",
      "PHONENO": "6423",
      "HIREDATE": "2003-09-14",
      "JOB": "MANAGER ",
      "EDLEVEL": 16,
      "SEX": "M",
      "BIRTHDATE": "1975-07-07",
      "SALARY": 72250,
      "BONUS": 500,
      "COMM": 2580,
      "DEPTNAME": "MANUFACTURING SYSTEMS"
    },
    {
      "EMPNO": "000070",
      "FIRSTNME": "EVA",
      "MIDINIT": "D",
      "LASTNAME": "PULASKI",
      "WORKDEPT": "D21",
      "PHONENO": "7831",
      "HIREDATE": "2005-09-30",
      "JOB": "MANAGER ",
      "EDLEVEL": 16,
      "SEX": "F",
      "BIRTHDATE": "2003-05-26",
      "SALARY": 96170,
      "BONUS": 700,
      "COMM": 2893,
      "DEPTNAME": "ADMINISTRATION SYSTEMS"
    },
    {
      "EMPNO": "000090",
      "FIRSTNME": "EILEEN",
      "MIDINIT": "W",
      "LASTNAME": "HENDERSON",
      "WORKDEPT": "E11",
      "PHONENO": "5498",
      "HIREDATE": "2000-08-15",
      "JOB": "MANAGER ",
      "EDLEVEL": 16,
      "SEX": "F",
      "BIRTHDATE": "1971-05-15",
      "SALARY": 89750,
      "BONUS": 600,
      "COMM": 2380,
      "DEPTNAME": "OPERATIONS"
    }
  ]
})
}


// insert new employee
async function insertEmployee(employee_def,resolve,reject) {
  //console.log(JSON.stringify(employee_def))
    /*
    {
      empno: '1376',
      firstnme: 'Benoit',
      lastname: 'Clerget',
      department: 'A00',
      edlevel: 3,
      salary: 42000
    }
    */
  if (window.fetch) {
    let myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    fetch('/api/employee',{
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(employee_def)
    }).then(function(response) {
      if(response.ok) {
        response.json().then(function(myJson) {
          if (myJson.err && myJson.err != 'EXIST_OR_NOTAUTH') {
            console.error('API error: ' + myJson.message);
            reject({err: true, message: myJson.message})
          } else {
            resolve(myJson)
          }
        });
      } else {
        console.error('response error: ' + response.ok);
        reject({err: true, message: 'Error inserting employee def'})
      }
    })
    .catch(function(error) {
      console.error('Error with post operation: ' + error);
      reject({err: true, message: 'unknownerror'})
    });
  } else {
    console.error('fetch not supported');
    reject({err: true, message: 'fetch not supported'})
  }
}

// update employee level
async function updateEmployeeLevel(emp_level,resolve,reject) {
    /*
    {
      empno: '1376',
      new_level: 5
    }
    */
    if (window.fetch) {
    let myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    fetch(`/api/employee_level`,{
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(emp_level)
    }).then(function(response) {
      if(response.ok) {
        response.json().then(function(myJson) {
          if (myJson.err && myJson.err != 'NOTEXIST_OR_NOTAUTH') {
            console.error('API error: ' + myJson.message);
            reject({err: true, message: myJson.message})
          } else {
            resolve(myJson)
          }
        });
      } else {
        console.error('response error: ' + response.ok);
        reject({err: true, message: 'Error updating employee level'})
      }
    })
    .catch(function(error) {
      console.error('Error with post operation: ' + error);
      reject({err: true, message: 'unknownerror'})
    });
  } else {
    console.error('fetch not supported');
    reject({err: true, message: 'fetch not supported'})
  }
}

// delete employee record
async function deleteEmployee(empno,resolve,reject) {
  if (window.fetch) {
    let myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    fetch(`/api/employee/${empno}`,{
      method: 'DELETE',
      headers: myHeaders,
    }).then(function(response) {
      if(response.ok) {
        response.json().then(function(myJson) {
          if(myJson.err && myJson.err != 'NOTEXIST_OR_NOTAUTH') {
            console.error('API error: ' + myJson.message);
            reject({err: true, message: myJson.message})
          } else {
            resolve(myJson)
          }
        });
      } else {
        console.error('response error: ' + response.ok);
        reject({err: true, message: `Error deleting employee ${empno}`})
      }
    })
    .catch(function(error) {
      console.error('Error with post operation: ' + error);
      reject({err: true, message: 'unknownerror'})
    });
  } else {
    console.error('fetch not supported');
    reject({err: true, message: 'fetch not supported'})
  }
}


function addToasterNotification(notif_type, notif_obj, duration=8) {
  let projectsListTemplate = require("./templates/util/toasts_notification.handlebars");
  // get toaster count
  let toast_ct = document.querySelectorAll('div[id^="toast_info_"]').length
  let d = new Date();
  let tmp_html = projectsListTemplate({
    elem_id: toast_ct + 1,
    type: notif_type,
    title: notif_obj.title,
    subtitle: notif_obj.subtitle,
    timestamp: d.toLocaleTimeString(),
    duration: duration,
  })
  let toast_messages_div_elem = document.getElementById('toast_messages');
  toast_messages_div_elem.innerHTML = tmp_html + toast_messages_div_elem.innerHTML
  //Notification.create(document.getElementById(`toast_info_${toast_ct + 1}`));
  // we must reinstanciate all existing toast not yet closed
  // instanciate
  let toast_list = document.querySelectorAll('div[id^="toast_info_"]')
  toast_list.forEach((toast_elem, i) => {
    const instance = Notification.create(toast_elem);
    let duration = toast_elem.getAttribute('data-duration')?toast_elem.getAttribute('data-duration')*1:0
    if(!toast_elem.classList.contains('bx--toast-notification--error') && duration >= 1) {
      setTimeout(function(){
        try{
          instance.remove() 
        } catch(e) {
  
        }
      }, duration*1000);
    }
  })
}

export {getSystemInfos, getWebAppInfos, getEmployees, insertEmployee, updateEmployeeLevel, deleteEmployee, addToasterNotification}