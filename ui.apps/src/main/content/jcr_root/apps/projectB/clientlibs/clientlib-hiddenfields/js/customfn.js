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
  var formData = globals.functions.exportData();
  globals.functions.submitForm(formData, true, 'application/json');
  globals.functions.setProperty(globals.form, {'properties' : {'enableValidationMessageOnlyOnSubmit' : false}})
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
  // Disable the modal
  var modalInstance = document.querySelector('.cmp-adaptiveform-custom-loader');
  if (modalInstance) {
    modalInstance.style.display = 'none';
  }

  function getErrorDiv() {
    var errorDiv = document.getElementById('cmp-adaptiveform-submit-error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.classList.add('cmp-adaptiveform-button__errormessage')
      errorDiv.setAttribute('id', 'cmp-adaptiveform-submit-error-message');
      errorDiv.textContent = failureMessage;
    }
    return errorDiv;
  }

  var submitButtonContainer = document.querySelector('div[data-cmp-button-type="submit"]');
  if (submitButtonContainer) {
    // remove the attributes that were set during submission
    var submitBtn = submitButtonContainer.querySelector('button');
    submitBtn.classList.remove('optum-submit-button-class');
    submitBtn.removeAttribute('aria-disabled');
    var prevText = submitButtonContainer.getAttribute('custom-af-submit-btn-prev-text')
    submitButtonContainer.querySelector('span').textContent = prevText;
    // add an error div and append the error message
    var errorDiv = getErrorDiv();
    submitButtonContainer.appendChild(errorDiv);
    // add aria-described by in the butotn widget corresponding to this error div
    var existingAriaDescribedByForErrorDiv = submitButtonContainer.querySelector('button').getAttribute('aria-describedby');
    var ariaDescribedByForErrorDiv = "";
    if (existingAriaDescribedByForErrorDiv) {
      if (existingAriaDescribedByForErrorDiv.includes(errorDiv.getAttribute('id'))) {
        ariaDescribedByForErrorDiv = existingAriaDescribedByForErrorDiv;
      } else {
        ariaDescribedByForErrorDiv = existingAriaDescribedByForErrorDiv + " " + errorDiv.getAttribute('id');
      }
    } else {
      ariaDescribedByForErrorDiv = errorDiv.getAttribute('id')
    }
    submitBtn.setAttribute('aria-describedby', ariaDescribedByForErrorDiv)
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

/**
 * Submit Success Handler
 * @name submitSuccessHandler
 **/
function submitSuccessHandler(defaultUrl) {
  var url = document.querySelector("div[data-af-submission-redirect-url]").getAttribute('data-af-submission-redirect-url');
  if (!url) {
    url = defaultUrl;
  }
  window.location.href = url;
}


/**
 * setSubmitButtonAttributes
 * @name setSubmitButtonAttributes
 * @param {string} buttonTextOnSubmit The text to show on button while submitting
 */
function setSubmitButtonAttributes(buttonTextOnSubmit) {

  var validate = guideBridge.getFormModel().validate();

  var submitButtonContainer = document.querySelector('div[data-cmp-button-type="submit"]');
  if (validate.length == 0 && submitButtonContainer) {

    var submitBtn = submitButtonContainer.querySelector('button');
    submitBtn.classList.add('optum-submit-button-class');
    submitBtn.setAttribute('aria-disabled', true);
    submitBtn.querySelector('.cmp-adaptiveform-button__icon').style.display="block";
    if (!submitButtonContainer.getAttribute('custom-af-submit-btn-prev-text')) {
      var prevText = submitButtonContainer.querySelector('span').textContent;
      console.log('previous text' + prevText)
      submitButtonContainer.setAttribute('custom-af-submit-btn-prev-text', prevText);
    }
    submitButtonContainer.querySelector('.cmp-adaptiveform-button__text').textContent = buttonTextOnSubmit;
  }
}
