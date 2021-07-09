/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

//import _ from 'lodash'; // javascript utilities https://lodash.com/
//const util = require('util')
//const Handlebars = require("handlebars");

////// ibmdotcom carbon components //////
// for masthead example (L1) see https://codesandbox.io/s/nervous-morning-z4eom?file=/index.html
// and https://ibmdotcom-web-components.mybluemix.net/iframe.html?id=components-masthead--with-l-1 
//import '@carbon/ibmdotcom-web-components/es/components/dotcom-shell/dotcom-shell-container.js';
import '@carbon/ibmdotcom-web-components/es/components/masthead/masthead-container.js';
//import '@carbon/ibmdotcom-web-components/es/components/footer/footer-container.js';
//import '@carbon/ibmdotcom-web-components/es/components/image/image.js';
import '@carbon/ibmdotcom-web-components/es/components/horizontal-rule/horizontal-rule.js';
import '@carbon/ibmdotcom-web-components/es/components/link-with-icon/link-with-icon.js';
// expressive modal http://ibmdotcom-web-components.mybluemix.net/?path=/docs/components-expressive-modal--default
/*
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-header.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-heading.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-close-button.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-body.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-footer.js';
*/
// button group http://ibmdotcom-web-components.mybluemix.net/?path=/docs/components-button-group--default
import '@carbon/ibmdotcom-web-components/es/components/button-group/button-group.js';
import '@carbon/ibmdotcom-web-components/es/components/button-group/button-group-item.js';
//import 'carbon-web-components/es/icons/arrow--right/20.js';
// simple expressive button http://ibmdotcom-web-components.mybluemix.net/?path=/docs/components-button--default 
import '@carbon/ibmdotcom-web-components/es/components/button/button.js';
// toc
//import '@carbon/ibmdotcom-web-components/es/components/table-of-contents/table-of-contents.js';

////// carbon icons //////
//import 'svgxuse/svgxuse' // used by svg use icon see https://github.com/carbon-design-system/carbon-icons/blob/master/docs/usage.md
//import carbon_icons_svg_href from 'carbon-icons/dist/carbon-icons.svg';
////// @carbon/icons //////
//import { getAttributes, toString } from '@carbon/icon-helpers';
//import subtractAltIcon16 from '@carbon/icons/es/subtract--alt/16';

////// carbon components //////
import { Modal } from 'carbon-components';
//import { Loading } from 'carbon-components';
import { InlineLoading } from 'carbon-components';
//import { Accordion } from 'carbon-components';
//Accordion.create(document.getElementById('accordion_VSCSI'))


//// app scss
import './index.scss';

///// app js libraries /////
// comment and uncommented for normal or test usage (test using sample data without DB access)

// app functions
import {
  getSystemInfos,
  getWebAppInfos,
  getDepartments,
  getEmployees,
  insertEmployee,
  updateEmployeeLevel,
  deleteEmployee,
  addToasterNotification
} from './app_funcs'
// app constants for html dom manipulation
// main div
//const appcontentmain_elem = document.getElementById('appcontent_main');
// modal instance
const modal_instance = {}
// global app backend infos
const app_infos_obj = {}
// The minimum prerequisite to use our service for translation data, etc. (ibm header)
window.digitalData = {
  page: {
    pageInfo: {
      language: 'en-US',
      ibm: {
        siteID: 'IBMTESTWWW',
      },
    },
    isDataLayerReady: true,
  },
};

// first page loading: show list of employess
document.addEventListener("DOMContentLoaded", async function() {
  // set app modal content with util modal template
  // this avoid to see modal close elements during the initial document load
  let appmodalcontentTemplate = require("./templates/util/modal_content.handlebars");
  document.getElementById('app_modal').innerHTML = appmodalcontentTemplate()
  // create danger modal instance
  modal_instance.danger_xs = Modal.create(document.getElementById('danger-modal-xs'));
  // create input modal instance
  modal_instance.input = Modal.create(document.getElementById('input-modal'));



  // retrieve web app backend infos
  let resp_json = await getWebAppInfos()
  if(!resp_json.err) {
    app_infos_obj.web_server_infos = resp_json.web_infos
  } else {
    app_infos_obj.web_server_infos = { name: 'db2-samplejs', version: '?'}
  }
  document.getElementById('app_title').innerHTML = `${app_infos_obj.web_server_infos.name} ${app_infos_obj.web_server_infos.version}`
  let appemployees_div_head_elem = document.getElementById('appemployees_div_head');
  appemployees_div_head_elem.innerHTML = `<h2>${app_infos_obj.web_server_infos.name} application</h2>`
  appemployees_div_head_elem.style.display = 'block'

  let appemployees_div_infos1_elem = document.getElementById('appemployees_div_infos1');
  let appemployees_div_infos2_elem = document.getElementById('appemployees_div_infos2');
  let appemployees_div_infos3_elem = document.getElementById('appemployees_div_infos3');
  appemployees_div_infos1_elem.classList.remove('app--error_msg')
  appemployees_div_infos2_elem.classList.remove('app--error_msg')
  appemployees_div_infos3_elem.classList.remove('app--error_msg')
  appemployees_div_infos1_elem.innerHTML = `Some wab app infos here`
  appemployees_div_infos2_elem.innerHTML = `Some system infos here`
  appemployees_div_infos3_elem.innerHTML = `Some DB infos here`
  appemployees_div_infos1_elem.style.display = 'block'
  appemployees_div_infos2_elem.style.display = 'block'
  appemployees_div_infos3_elem.style.display = 'block'
// retrieve backend information
  getSystemInfos(function(response){
    if (!response.err) {
      // set info1 infos (web app)
      let appemployeesWebAppInfosTemplate = require("./templates/employees/employees_webapp_infos.handlebars")
      appemployees_div_infos1_elem.innerHTML = appemployeesWebAppInfosTemplate({
        web_app: response.web_app,
      })
      // set info2 infos (system)
      /*
      if(response.system.kubepods_self_cgroup!='' && !response.system.kubepods) {
        response.system.kubepods = true
      }
      if(response.system.docker_self_cgroup!='' && !response.system.docker) {
        response.system.docker = true
      }
      */
      let appemployeesSystemInfosTemplate = require("./templates/employees/employees_system_infos.handlebars")
      appemployees_div_infos2_elem.innerHTML = appemployeesSystemInfosTemplate({
        system: response.system,
      })
      // set info3 infos (db)
      let appemployeesDBInfosTemplate = require("./templates/employees/employees_db_infos.handlebars")
      appemployees_div_infos3_elem.innerHTML = appemployeesDBInfosTemplate({
        db_infos: response.db_infos,
      })
    } else {
      console.error('getSystemInfos error: ' + response.message);
      appemployees_div_infos1_elem.innerHTML = `${response.message}`
      appemployees_div_infos2_elem.innerHTML = `${response.message}`
      appemployees_div_infos1_elem.classList.add('app--error_msg')
      appemployees_div_infos2_elem.classList.add('app--error_msg')
    }
  },function(error){
    console.error('getSystemInfos reject error: ' + error.message);
    appemployees_div_infos1_elem.innerHTML = `${error.message}`
    appemployees_div_infos2_elem.innerHTML = `${error.message}`
    appemployees_div_infos1_elem.classList.add('app--error_msg')
    appemployees_div_infos2_elem.classList.add('app--error_msg')
  })

  // display list of employees (default page) 
  showEmployees()
})

// display employees page 
export function showEmployees() {
  // final horizontal rule
  document.getElementById('appemployees_hrule').contrast = "low-contrast";
  document.getElementById('appemployees_hrule').weight = "thick";

  let appemployees_div_list_elem = document.getElementById('appemployees_div_list');
  appemployees_div_list_elem.innerHTML = `<div id="employees_inlineloading" data-inline-loading class="bx--inline-loading" role="alert" aria-live="assertive">
    <div class="bx--inline-loading__animation">
      <div data-inline-loading-spinner class="bx--loading bx--loading--small">
        <svg class="bx--loading__svg" viewBox="-75 -75 150 150">
          <circle class="bx--loading__background" cx="0" cy="0" r="50" />
          <circle class="bx--loading__stroke" cx="0" cy="0" r="50"/>
        </svg>
      </div>
      <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-loading__checkmark-container" hidden="" data-inline-loading-finished="" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8,1C4.1,1,1,4.1,1,8c0,3.9,3.1,7,7,7s7-3.1,7-7C15,4.1,11.9,1,8,1z M7,11L4.3,8.3l0.9-0.8L7,9.3l4-3.9l0.9,0.8L7,11z"></path><path d="M7,11L4.3,8.3l0.9-0.8L7,9.3l4-3.9l0.9,0.8L7,11z" data-icon-path="inner-path" opacity="0"></path></svg>
      <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-loading--error" hidden="" data-inline-loading-error="" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M2,16H2A14,14,0,1,0,16,2,14,14,0,0,0,2,16Zm23.15,7.75L8.25,6.85a12,12,0,0,1,16.9,16.9ZM8.24,25.16A12,12,0,0,1,6.84,8.27L23.73,25.16a12,12,0,0,1-15.49,0Z"></path></svg>
    </div>
    <p data-inline-loading-text-active class="bx--inline-loading__text">Loading employees details, please wait...</p>
    <p data-inline-loading-text-finished hidden class="bx--inline-loading__text">Employees details loaded successfully</p>
    <p data-inline-loading-text-error hidden class="bx--inline-loading__text">Employees details loading failed!!</p>
  </div>
  `
  appemployees_div_list_elem.classList.remove('app--error_msg')
  appemployees_div_list_elem.style.display = 'block'
  let inlineloading_employeeselem = document.getElementById('employees_inlineloading')
  let inLineloadingInstanceEmployees = InlineLoading.create(inlineloading_employeeselem)
  inLineloadingInstanceEmployees.setState(InlineLoading.states.ACTIVE)
  // prepare refresh top and bottom button action
  let appemployees_refresh_top_btn_elem = document.getElementById('appemployees_refresh_top_btn')
  appemployees_refresh_top_btn_elem.addEventListener('click', () => {
    showEmployees()
  })
  let appemployees_refresh_btn_elem = document.getElementById('appemployees_refresh_btn')
  appemployees_refresh_btn_elem.addEventListener('click', () => {
    showEmployees()
  })
  let appemployees_create_employee_top_btn_elem = document.getElementById('appemployees_create_employee_top_btn')
  appemployees_create_employee_top_btn_elem.disabled = true

  // Retrieve employees from DB
  getEmployees(function(response){
    if (!response.err) {
      inLineloadingInstanceEmployees.setState(InlineLoading.states.FINISHED)
      inLineloadingInstanceEmployees.release()
      let employeesListTemplate = require("./templates/employees/employees_list.handlebars")
      appemployees_div_list_elem.innerHTML = employeesListTemplate({
        employees: response.employees,
      })
      // show insert button
      appemployees_create_employee_top_btn_elem.addEventListener('click', () => {
        insert_employee()
      })
      appemployees_create_employee_top_btn_elem.disabled = false
    } else {
      console.error('getEmployees error: ' + response.message);
      inLineloadingInstanceEmployees.setState(InlineLoading.states.ERROR)
      appemployees_div_list_elem.innerHTML = 'ERROR No employees retrieved from DB...'
      appemployees_div_list_elem.classList.add('app--error_msg')
    }
    // enable refresh top and bottom button
    appemployees_refresh_top_btn_elem.disabled = false
    appemployees_refresh_btn_elem.disabled = false
  },function(error){
    console.error('getEmployees reject error: ' + error.message);
    inLineloadingInstanceEmployees.setState(InlineLoading.states.ERROR)
    appemployees_div_list_elem.innerHTML = 'ERROR No employees retrieved from DB...'
    // enable refresh top and bottom button
    appemployees_refresh_top_btn_elem.disabled = false
    appemployees_refresh_btn_elem.disabled = false
  })
}

export function delete_employee(empno,fistname,lastname) {
  // set modal title and subtitle
  document.getElementById('danger-modal-xs-label').innerHTML = `Employee deletion`
  document.getElementById('danger-modal-xs-heading').innerHTML = `Do you confirm to delete the employee: ${fistname} ${lastname} (${empno})?`
  // Create the button action by fill in the footer innetHTML, this destroy any remaining event on the button
  // set focus on cancel button
  document.getElementById('danger-modal-xs-footer').innerHTML = `
    <button class="bx--btn bx--btn--secondary dbm--cancel-btn" type="button" data-modal-close data-modal-primary-focus id="danger-modal-xs-btn-cancel">Cancel</button>
    <button class="bx--btn bx--btn--danger dbm--danger-btn" type="button" aria-label="Danger" id="danger-modal-xs-btn-ok">Delete</button>
  `
  // cancel button event => no need to add an event, this is handled by data-modal-close
  // create button event
  document.getElementById('danger-modal-xs-btn-ok').addEventListener('click', () => {
    // close modal
    modal_instance.danger_xs.hide();
    console.log(`Send request to delete employee: ${fistname} ${lastname} (${empno})`)
    addToasterNotification('info', { title: `Employee ${empno} delete request in progress...`, subtitle: `${fistname} ${lastname}`}, 4)
    // call api
    deleteEmployee(empno, function(response){
        if (!response.err) {
          //console.log(response.message)
          addToasterNotification('success', { title: `Employee ${empno} delete request done`, subtitle: ''}, 10)
          // refresh employee list
          showEmployees() 
        } else {
          addToasterNotification('error', { title: `Employee ${empno} delete request failed`, subtitle: 'employee not defined or permission is required'})
          console.error('deleteEmployee error: ' + response.message);
        }
      },function(error){
        addToasterNotification('error', { title: `Employee ${empno} delete request failed`, subtitle: 'DB error'})
        console.error('deleteEmployee reject error: ' + error.message);
      }
    )
  })
  modal_instance.danger_xs.show();

}

// update employee level
export function update_level(empno,fistname,lastname,current_level) {
  // set modal title and subtitle
  document.getElementById('input-modal-label').innerHTML = `Update employee level`
  document.getElementById('input-modal-heading').innerHTML = `Select the new level for employee ${fistname} ${lastname} (${empno})`
  let tmp_input_modal_content_elem = document.getElementById('input-modal-content')
  
  // generate form select fields (focus on level select field)
  let employeeLeveUpdateFormTemplate = require("./templates/employees/employee_update_level_form.handlebars");
  tmp_input_modal_content_elem.innerHTML = employeeLeveUpdateFormTemplate({
    current_level: current_level, // current employee level
    employee_levels: [ // levels list
      '10','11','12','13','14','15','16','17','18','19','20'
    ],  
  })

  // Create the button action by fill in the footer innetHTML, this destroy any remaining event on the button
  document.getElementById('input-modal-footer').innerHTML = `
    <button class="bx--btn bx--btn--secondary dbm--cancel-btn" type="button" data-modal-close id="input-modal-btn-cancel">Cancel</button>
    <button class="bx--btn bx--btn--danger dbm--danger-btn" type="button" aria-label="Danger" id="input-modal-btn-ok">Update</button>
  `
  // cancel button event => no need to add an event, this is handled by data-modal-close
  // create button event
  document.getElementById('input-modal-btn-ok').addEventListener('click', () => {
    // get selected values
    let employee_level_elem = document.getElementById('employee_levels-input-modal')
    if(employee_level_elem.value == 'NA' || employee_level_elem.value == current_level) {
      // the server must be different than current level
      document.getElementById('employee_levels-input-wrapper_modal').setAttribute('data-invalid', true)
    } else {
      // close modal
      modal_instance.input.hide();
      let input_level_obj = { empno: empno, new_level: employee_level_elem.value}
      console.log(`Send request to update level for employee: ${fistname} ${lastname} (${empno})` )
      addToasterNotification('info', { title: `Level update for employee ${fistname} ${lastname} (${empno}) request in progress...`, subtitle: `New level: ${employee_level_elem.value}`})
      // call api
      updateEmployeeLevel(input_level_obj, function(response){
          if (!response.err) {
            //console.log(response.message)
            addToasterNotification('success', { title: `Employee ${empno} level update request done`, subtitle: ''}, 10)
            // refresh employee list
            showEmployees() 
          } else {
            addToasterNotification('error', { title: `Employee ${empno} level update request failed`, subtitle: 'employee not defined or permission is required'})
            console.error('updateEmployeeLevel error: ' + response.message);
          }
        },function(error){
          addToasterNotification('error', { title: `Employee ${empno} level update request failed`, subtitle: 'DB error'})
          console.error('updateEmployeeLevel reject error: ' + error.message);
        }
      )
    }
  })
  // open modal
  modal_instance.input.show();
}

// insert new employee
export function insert_employee() {
  // set modal title and subtitle
  document.getElementById('input-modal-label').innerHTML = `Create new employee`
  document.getElementById('input-modal-heading').innerHTML = `Fill in the mandatory fields and click the Create button`
  let tmp_input_modal_content_elem = document.getElementById('input-modal-content')
  
  // get departments list
  getDepartments(function(response){
    if (!response.err) {
      // generate form input fields (focus on level select field)
      let employeeCreateFormTemplate = require("./templates/employees/employee_create_form.handlebars");
      tmp_input_modal_content_elem.innerHTML = employeeCreateFormTemplate({
        departments: response.departments, // department list from DB
        levels: [ // edlevels list
          '10','11','12','13','14','15','16','17','18','19','20'
        ],  
      })

      // Create the button action by fill in the footer innetHTML, this destroy any remaining event on the button
      document.getElementById('input-modal-footer').innerHTML = `
        <button class="bx--btn bx--btn--secondary app--cancel-btn" type="button" data-modal-close id="input-modal-btn-cancel">Cancel</button>
        <button class="bx--btn bx--btn--danger app--danger-btn" type="button" aria-label="Danger" id="input-modal-btn-ok">Create</button>
      `
      // cancel button event => no need to add an event, this is handled by data-modal-close
      // create button event
      document.getElementById('input-modal-btn-ok').addEventListener('click', () => {
        // get and verify input values
        let input_employee_obj = {
          empno: '1234',
          firstnme: 'John',
          lastname: 'Doe',
          department: null,
          edlevel: 10,
          salary: 100,
        }
        let input_verif_ok = true
        let tmp_elem = document.getElementById('employee_level_input')
        if(tmp_elem.value == 'NA') {
          document.getElementById('employee_level_input_wrapper').setAttribute('data-invalid', true)
          input_verif_ok = false
        } else {
          document.getElementById('employee_level_input_wrapper').removeAttribute('data-invalid')
          input_employee_obj.edlevel = tmp_elem.value * 1
        }
        tmp_elem = document.getElementById('employee_department_input')
        if(tmp_elem.value == 'NA') {
          document.getElementById('employee_department_input_wrapper').setAttribute('data-invalid', true)
          input_verif_ok = false
        } else {
          document.getElementById('employee_department_input_wrapper').removeAttribute('data-invalid')
          input_employee_obj.department = tmp_elem.value
        }
        tmp_elem = document.getElementById('employee_empno_input')
        if(tmp_elem.value == '') {
          tmp_elem.setAttribute('data-invalid', true)
          input_verif_ok = false
        } else {
          tmp_elem.removeAttribute('data-invalid')
          input_employee_obj.empno = tmp_elem.value
        }
        tmp_elem = document.getElementById('employee_firstname_input')
        if(tmp_elem.value == '') {
          tmp_elem.setAttribute('data-invalid', true)
          input_verif_ok = false
        } else {
          tmp_elem.removeAttribute('data-invalid')
          input_employee_obj.firstnme = tmp_elem.value
        }
        tmp_elem = document.getElementById('employee_lastname_input')
        if(tmp_elem.value == '') {
          tmp_elem.setAttribute('data-invalid', true)
          input_verif_ok = false
        } else {
          tmp_elem.removeAttribute('data-invalid')
          input_employee_obj.lastname = tmp_elem.value
        }
        tmp_elem = document.getElementById('employee_salary_input')
        if(!tmp_elem.value || tmp_elem.value == '' || tmp_elem.value < 15000) {
          document.getElementsByName('employee_salary_input')[0].setAttribute('data-invalid', true)
          input_verif_ok = false
        } else {
          document.getElementsByName('employee_salary_input')[0].removeAttribute('data-invalid')
          input_employee_obj.salary = tmp_elem.value * 1
        }

        if(input_verif_ok) {
          // close modal
          modal_instance.input.hide();
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
          console.log(`Send request to create new employee: ${input_employee_obj.firstnme} ${input_employee_obj.lastname} (${input_employee_obj.empno})`)
          addToasterNotification('info', { title: `Employee ${input_employee_obj.firstnme} ${input_employee_obj.lastname} (${input_employee_obj.empno}) creation request in progress...`, subtitle: ``})
          // call api
          insertEmployee(input_employee_obj, function(response){
              if (!response.err) {
                addToasterNotification('success', { title: `Employee ${input_employee_obj.empno} level update request done`, subtitle: ''}, 10)
                // refresh employee list
                showEmployees() 
              } else {
                addToasterNotification('error', { title: `Employee ${input_employee_obj.empno} creation request failed`, subtitle: 'empno already exists or permission is required'})
                console.error('insertEmployee error: ' + response.message);
              }
            },function(error){
              addToasterNotification('error', { title: `Employee ${input_employee_obj.empno} creation request failed`, subtitle: 'DB error'})
              console.error('insertEmployee reject error: ' + error.message);
            }
          )
        }
      })
      // open modal
      modal_instance.input.show();
    } else {
      console.error('getDepartments error: ' + response.message);
      dbmproject_div_users_elem.innerHTML = 'ERROR No departments infos retrieved from DB...'
    }
    },function(error){  
    console.error('getDepartments reject error: ' + error.message);
    dbmproject_div_users_elem.innerHTML = 'ERROR No departments infos retrieved from DB...'
  })
}

