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
function setHiddenFields(){
  var HIDDEN_FIELD_DATA_SELECTOR = "div[data-af-hidden-fields]";
  var HIDDEN_FIELD_DATA_ATTR = "data-af-hidden-fields";
  guideBridge.connect(function() {
    if (guideBridge.isConnected()) {
      var fieldsKVPair = {}
      var dataSiteHiddenFields = document.querySelector(HIDDEN_FIELD_DATA_SELECTOR).getAttribute(HIDDEN_FIELD_DATA_ATTR).split(';');
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
  })
}




