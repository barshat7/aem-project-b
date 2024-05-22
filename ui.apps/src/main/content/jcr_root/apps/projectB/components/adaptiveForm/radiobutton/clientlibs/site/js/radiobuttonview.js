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
    class CustomRadioButton extends FormView.FormOptionFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormRadioButton";
        static bemBlock = 'cmp-adaptiveform-radiobutton';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widgets: `.${CustomRadioButton.bemBlock}__widget`,
            widget: `.${CustomRadioButton.bemBlock}__option__widget`,
            label: `.${CustomRadioButton.bemBlock}__label`,
            description: `.${CustomRadioButton.bemBlock}__longdescription`,
            qm: `.${CustomRadioButton.bemBlock}__questionmark`,
            errorDiv: `.${CustomRadioButton.bemBlock}__errormessage`,
            tooltipDiv: `.${CustomRadioButton.bemBlock}__shortdescription`,
            option: `.${CustomRadioButton.bemBlock}__option`,
            optionLabel: `.${CustomRadioButton.bemBlock}__option-label`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(CustomRadioButton.selectors.qm);
        }

        getWidgets() {
            return this.element.querySelector(CustomRadioButton.selectors.widgets);
        }

        getWidget() {
          return this.element.querySelectorAll(CustomRadioButton.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(CustomRadioButton.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(CustomRadioButton.selectors.label);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(CustomRadioButton.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(CustomRadioButton.selectors.tooltipDiv);
        }

        getErrorDiv() {
            return this.element.querySelector(CustomRadioButton.selectors.errorDiv);
        }

        getOptions() {
            return this.element.querySelectorAll(CustomRadioButton.selectors.option);
        }

        _syncWidget() {
            let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
            let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
            widgetElement = widgetElements || widgetElement;
            if (widgetElement) {
                widgetElement.setAttribute('id', this.getWidgetId());
            }
        }

        /**
         * Synchronizes the label element with the model.
         * @private
         */
        _syncLabel() {
            var labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
            if (labelElement) {
                labelElement.setAttribute('for', this.getWidgetId());
            }
        }


        _syncError() {
            var errorElement = typeof this.getErrorDiv === 'function' ? this.getErrorDiv() : null;
            if (errorElement) {
                errorElement.setAttribute('id', `${this.getId()}__errormessage`);
            }
        }

        _syncShortDesc() {
            var shortDescElement = typeof this.getTooltipDiv === 'function' ? this.getTooltipDiv() : null;
            if (shortDescElement) {
                shortDescElement.setAttribute('id', `${this.getId()}__shortdescription`);
            }
        }

        _syncLongDesc() {
            var longDescElement = typeof this.getDescription === 'function' ? this.getDescription() : null;
            if (longDescElement) {
                longDescElement.setAttribute('id', `${this.getId()}__longdescription`);
            }
        }

        syncMarkupWithModel() {

            this._syncLabel()
            this._syncWidget()
            this._syncShortDesc()
            this. _syncLongDesc()
            this._syncError()

            var legend = this.element.querySelector("legend");
            var legendId = this.getId() + "__legend"
            legend.setAttribute('id', legendId);

            var ariaLabelledBy = legendId;

            function appendDescription(descriptionType, id) {
                ariaLabelledBy += ` ${id}__${descriptionType}`;
            }

            if (this.element) {
                if (this.getDescription()) {
                    appendDescription('longdescription', this.getId());
                }

                if (this.getTooltipDiv()) {
                    appendDescription('shortdescription', this.getId());
                }

                if (this.getErrorDiv() && this.getErrorDiv().innerHTML) {
                    appendDescription('errormessage', this.getId());
                }
                this.element.setAttribute('aria-labelledby', ariaLabelledBy);
            }
        }

        setModel(model) {
            super.setModel(model);
            let widgets = this.widget;
            widgets.forEach(widget => {
                widget.addEventListener('change', (e) => {
                    this._model.value = e.target.value;
                });
                widget.addEventListener('focus', (e) => {
                    this.setActive();
                });
                widget.addEventListener('blur', (e) => {
                    this.setInactive();
                });
            });
        }

        updateEnabled(enabled, state) {
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            let widgets = this.widget;
            widgets.forEach(widget => {
                if (enabled === false) {
                    if(state.readOnly === false){
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                        widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
                    }
                } else if (state.readOnly === false) {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                    widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
                }
            });
        }

        updateReadOnly(readonly) {
            let widgets = this.widget;
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_READONLY, readonly);
            widgets.forEach(widget => {
                if (readonly === true) {
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                } else {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED); 
                }
            });
        }

        updateValidity(validity) {
            const valid = validity.valid ? validity.valid : false;
            let widgets = this.widget;
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_VALID, valid);
            widgets.forEach(widget => widget.setAttribute(FormView.Constants.ARIA_INVALID, !valid));
        } 

        updateValue(modelValue) {
            this.widget.forEach(widget => {
                if (modelValue != null && widget.value != null && (modelValue.toString() == widget.value.toString())) {
                    widget.checked = true;
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, true);
                } else {
                    widget.checked = false;
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
                }
            }, this)
            super.updateEmptyStatus();
        }

        #createRadioOption(value, itemLabel) {
            const optionTemplate = `
            <div class="${RadioButton.selectors.option.slice(1)}">
                <label class="${RadioButton.selectors.optionLabel.slice(1)}">
                    <input type="checkbox" class="${RadioButton.selectors.widget.slice(1)}" value="${value}">
                    <span>${itemLabel}</span>
                </label>
            </div>`;

            const container = document.createElement('div'); // Create a container element to hold the template
            container.innerHTML = optionTemplate;
            return container.firstElementChild; // Return the first child, which is the created option
        }

        updateEnum(newEnums) {
            super.updateEnumForRadioButtonAndCheckbox(newEnums, this.#createRadioOption);
        }

        updateEnumNames(newEnumNames) {
            super.updateEnumNamesForRadioButtonAndCheckbox(newEnumNames, this.#createRadioOption)
        }

        updateRequired(required, state) {
            if (this.widget) {
                this.element.toggleAttribute("required", required);
                this.element.setAttribute("data-cmp-required", required);
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new CustomRadioButton({element, formContainer});
    }, CustomRadioButton.selectors.self);

})();
