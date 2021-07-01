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
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-header.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-heading.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-close-button.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-body.js';
import '@carbon/ibmdotcom-web-components/es/components/expressive-modal/expressive-modal-footer.js';
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
import {getEmployees, inserEmployee, updateEmployeeLevel, addToasterNotification} from './app_funcs'
// app constants for html dom manipulation
// main div
const appcontentmain_elem = document.getElementById('appcontent_main');
// modal instance
const modal_instance = {}

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

// first page loading: show list of projects and userinfo
document.addEventListener("DOMContentLoaded", async function() {
  // set app modal content with util modal template
  // this avoid to see modal close elements during the initial document load
  let appmodalcontentTemplate = require("./templates/util/modal_content.handlebars");
  document.getElementById('app_modal').innerHTML = appmodalcontentTemplate()
  // create danger modal instance
  modal_instance.danger_xs = Modal.create(document.getElementById('danger-modal-xs'));
  // create input modal instance
  modal_instance.input = Modal.create(document.getElementById('input-modal'));

  // display list of employees (default page) 
  showEmployees()

})

// display employees page 
export function showEmployees() {
  // set app main content
  let appcontentmainTemplate = require("./templates/employees/employees_main.handlebars");
  appcontentmain_elem.innerHTML = appcontentmainTemplate()
  // final horizontal rule
  document.getElementById('appemployees_hrule').contrast = "low-contrast";
  document.getElementById('appemployees_hrule').weight = "thick";

  let appemployees_div_head_elem = document.getElementById('appemployees_div_head');
  appemployees_div_head_elem.innerHTML = `<h2>Employees list</h2>`
  let appemployees_div_infos1_elem = document.getElementById('appemployees_div_infos1');
  let appemployees_div_infos2_elem = document.getElementById('appemployees_div_infos2');
  appemployees_div_infos1_elem.innerHTML = `<div id="employees_infos1_inlineloading" data-inline-loading class="bx--inline-loading" role="alert" aria-live="assertive">
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
  document.getElementById("appemployees_div").style.display = 'block'
  appemployees_div_head_elem.style.display = 'block'
  appemployees_div_infos1_elem.style.display = 'block'
  appemployees_div_infos2_elem.style.display = 'block'
  let inlineloading_employeeselem = document.getElementById('employees_infos1_inlineloading')
  let inLineloadingInstanceEmployees = InlineLoading.create(inlineloading_employeeselem)
  inLineloadingInstanceEmployees.setState(InlineLoading.states.ACTIVE)
  // Retrieve employees from DB
  getEmployees(function(response){
    if (!response.err) {
      inLineloadingInstanceEmployees.setState(InlineLoading.states.FINISHED)
      inLineloadingInstanceEmployees.release()
      appemployees_div_infos1_elem.innerHTML = `to be completed`
      appemployees_div_infos2_elem.innerHTML = `to be completed`
      let appemployees_div_list_elem = document.getElementById('appemployees_div_list');
      let employeesListTemplate = require("./templates/employees/employees_list.handlebars")
      appemployees_div_list_elem.innerHTML = employeesListTemplate({
        employees: response.employees,
      })
     appemployees_div_list_elem.style.display = 'block'
    } else {
      console.error('getEmployees error: ' + response.message);
      inLineloadingInstanceEmployees.setState(InlineLoading.states.ERROR)
      appemployees_div_infos1_elem.innerHTML = 'ERROR No employees retrieved from DB...'
    }
  },function(error){
    console.error('getEmployees reject error: ' + error.message);
    inLineloadingInstanceEmployees.setState(InlineLoading.states.ERROR)
    appemployees_div_infos1_elem.innerHTML = 'ERROR No employees retrieved from DB...'
  })
}

