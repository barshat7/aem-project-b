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
 * Reload Form
 * @name reloadForm
 **/
function reloadForm() {
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });
}
