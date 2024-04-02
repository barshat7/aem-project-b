/*******************************************************************************
 * Copyright 2022 Adobe
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
(function() {

    "use strict";
    class CustomTextInput extends FormView.v1.TextInput {

        static NS = FormView.Constants.NS;
        static IS = FormView.v1.TextInput.IS;
        static bemBlock = FormView.v1.TextInput.bemBlock;
        static selectors  = FormView.v1.TextInput.selectors;

        constructor(params) {
            super(params);
        }

        setActive() {
            super.setActive();
            if (this.formContainer.getModel()?.properties?.enableValidationMessageOnlyOnSubmit === true) {
                const prevVal  = this._model.value;
                this._model.value = 'null';
                this._model.value = prevVal;
            }

        }


        updateValidity(validity, state) {
            if (this.formContainer.getModel()?.properties?.enableValidationMessageOnlyOnSubmit === true || state.valid === true) {
                super.updateValidity(validity, state);
            }

        }

        updateValidationMessage(validationMessage, state) {
            if (this.formContainer.getModel()?.properties?.enableValidationMessageOnlyOnSubmit === true || state.valid === true) {
                super.updateValidationMessage(validationMessage, state);
                // reset the value of 'enableValidationMessageOnlyOnSubmit' so that this condition is not true on re-submit
                this.formContainer.getModel().properties.enableValidationMessageOnlyOnSubmit = false;
            }
        }

        subscribe() {
            const changeHandlerName = (propName) => `update${propName[0].toUpperCase() + propName.slice(1)}`
            this._model.subscribe((action) => {
                let state = action.target.getState();
                const changes = action.payload.changes;
                changes.forEach(change => {
                    const fn = changeHandlerName(change.propertyName);
                    if (change.propertyName === 'value') {
                        //this.#triggerEventOnGuideBridge(this.ELEMENT_VALUE_CHANGED, change);
                    }
                    if (change.propertyName == 'validationMessage') {
                        //debugger;
                    }
                    if (typeof this[fn] === "function") {
                        this[fn](change.currentValue, state);
                    } else {
                        console.warn(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                    }
                })
            });
        }


    }


    FormView.Utils.setupField(({element, formContainer}) => {
        return new CustomTextInput({element, formContainer})
    }, CustomTextInput.selectors.self);

})();
