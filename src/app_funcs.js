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
        return {err: true, message: 'Error retreiving web app infos response'}
      }
  
    } catch(error) {
      console.error('Error with fetch operation: ' + error);
      return {err: true, message: 'Error retreiving web app infos response'}
    }
  } else {
    console.error('fetch not supported');
    return {err: true, message: 'fetch not supported'}
  }
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
        reject({err: true, message: 'Error retreiving employees API response'})
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

export {getWebAppInfos, getEmployees, insertEmployee, updateEmployeeLevel, deleteEmployee, addToasterNotification}