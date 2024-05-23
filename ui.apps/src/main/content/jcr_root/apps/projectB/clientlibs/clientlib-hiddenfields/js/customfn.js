/*******************************************************************************
 * Copyright 2024 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/


/**
 * set hidden fields
 * @name setHiddenFields
 */
function setHiddenFields() {
  var HIDDEN_FIELD_DATA_SELECTOR = "div[data-af-hidden-fields]";
  var HIDDEN_FIELD_DATA_ATTR = "data-af-hidden-fields";
  guideBridge.connect(function() {
    if (guideBridge.isConnected()) {
      var fieldsKVPair = {}
      var hiddenFieldAttrDiv = document.querySelector(HIDDEN_FIELD_DATA_SELECTOR);
      if (hiddenFieldAttrDiv && hiddenFieldAttrDiv.getAttribute(HIDDEN_FIELD_DATA_ATTR)) {
        var dataSiteHiddenFields = hiddenFieldAttrDiv.getAttribute(HIDDEN_FIELD_DATA_ATTR).split(';');
        for (var i = 0; i < dataSiteHiddenFields.length; i++) {
          var kv = dataSiteHiddenFields[i].split('=');
          fieldsKVPair[kv[0]] = kv[1]
        }
        var formFields = guideBridge.getFormModel()._fields;
        for (var kv in fieldsKVPair) {
          for (var _field in formFields) {
            if (formFields[_field].name == kv) {
              formFields[_field].value = fieldsKVPair[kv];
            }
          }
        }
      } else {
        console.log('guidebridge is not connected')
      }
    }
  })
}


/**
 * enableValidationMessageOnlyOnSubmit
 * @name enableValidationMessageOnlyOnSubmit
 * @param {scope} globals
 */
function enableValidationMessageOnlyOnSubmit(globals) {
  globals.functions.setProperty(globals.form, {'properties' : {'enableValidationMessageOnlyOnSubmit' : true}})
}


/**
   * Show animation while form submission is in progress
   * @param {scope} globals
   **/
function showLoadingAnimation(globals) {
     
  if (globals.functions.validate().length === 0) {
    var modalInstance = document.querySelector('.cmp-adaptiveform-custom-loader');
    if (modalInstance) {
      modalInstance.style.display = 'flex';
      document.querySelector('.cmp-adaptiveform-custom-loader__icon').style.display='block'
      document.querySelector('.cmp-adaptiveform-custom-loader__close').style.display="none";
      document.querySelector('.cmp-adaptiveform-custom-loader__errormessage').style.display="none";
    }
  }
}

/**
 * Error handler for form
 * @param {string} failureMessage
 **/
function errorHandler(failureMessage) {
      var modalInstance = document.querySelector('.cmp-adaptiveform-custom-loader');
    if (modalInstance) {
        modalInstance.style.display = 'flex';
        document.querySelector('.cmp-adaptiveform-custom-loader__errormessage').style.display="block";
        document.querySelector('.cmp-adaptiveform-custom-loader__close').style.display="block";
        document.querySelector('.cmp-adaptiveform-custom-loader__errormessage p').innerHTML = failureMessage;
        document.querySelector('.cmp-adaptiveform-custom-loader__icon').style.display='none';
    }
}


/**
 * Add Modal on the form
 * @param {string} addDialog
 * @param {string} addDialog
 **/
function addDialog() {
  var modal = '<div class="cmp-adaptiveform-custom-loader"><button role="button" class="cmp-adaptiveform-custom-loader__close">X</button><div class="cmp-adaptiveform-custom-loader__icon">Submitting...</div> 	<div class="cmp-adaptiveform-custom-loader__errormessage"> 		<p> </p> 	</div> </div>';
  var modalElement = document.createElement('div');
  modalElement.innerHTML = modal;
  document.querySelector('body').appendChild(modalElement);
  document.querySelector('.cmp-adaptiveform-custom-loader__close').addEventListener('click', function() {    
      document.querySelector('.cmp-adaptiveform-custom-loader').style.display = 'none';
  });
}


/**
 * saveData from 
 * @name saveData Save Form Data periodically 
 */
function saveData() {

  try {
      var key = btoa(window.location.href) + "_afFormData";
      function savePeriodically() {
          var formData = guideBridge.getFormModel().exportData();
          var formDataStr = JSON.stringify(formData);
          localStorage.setItem(key, formDataStr);
          console.log('saved in session storage')
      }
      guideBridge.connect(function () {
          savePeriodically()
          window[key] = setInterval(savePeriodically, 2000);
      })
  } catch (e) {
      console.log('some error occurred while saving data in localstorage', e)
  }
}


/**
* fillData from 
* @name fillData Fill Form Data
*/
function fillData() {

  try {
      var key = btoa(window.location.href) + "_afFormData";
      var formDataStr = localStorage.getItem(key);
      if (formDataStr) {
          var formData = JSON.parse(formDataStr);

          guideBridge.connect(function () {
              guideBridge.getFormModel().importData(formData)
          })
      }
  } catch (e) {
      console.log('not able to fill form from localStorage', e);
  }
}

/**
* clearData from 
* @name clearData Clear Form Data From Local Storage
*/
function clearData() {
  try {
      var key = btoa(window.location.href) + "_afFormData";
      console.log('clearing data, clearing interval', key);
      clearInterval(window[key]);

      localStorage.removeItem(key);
  } catch (e) {
      console.log('some error occurred while deleting data from localStorage during submit ')
  }
}