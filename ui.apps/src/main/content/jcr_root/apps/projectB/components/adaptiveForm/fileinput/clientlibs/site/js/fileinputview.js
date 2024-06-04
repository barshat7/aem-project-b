/*******************************************************************************
 * Copyright 2023 Adobe
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
  class CustomFileInput extends FormView.FormFileInput {

    static NS = FormView.Constants.NS;
    /**
     * Each FormField has a data attribute class that is prefixed along with the global namespace to
     * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
     * data-{NS}-{IS}-x=""
     * @type {string}
     */
    static IS = "adaptiveFormFileInput";
    static bemBlock = 'cmp-adaptiveform-fileinput'
    static selectors  = {
      self: "[data-" + this.NS + '-is="' + this.IS + '"]',
      widget: `.${CustomFileInput.bemBlock}__widget`,
      label: `.${CustomFileInput.bemBlock}__label`,
      description: `.${CustomFileInput.bemBlock}__longdescription`,
      qm: `.${CustomFileInput.bemBlock}__questionmark`,
      errorDiv: `.${CustomFileInput.bemBlock}__errormessage`,
      tooltipDiv: `.${CustomFileInput.bemBlock}__shortdescription`,
      fileListDiv : `.${CustomFileInput.bemBlock}__filelist`,
      attachButtonLabel : `.${CustomFileInput.bemBlock}__widgetlabel`,
      dragArea: `.${CustomFileInput.bemBlock}__dragarea`
    };

    constructor(params) {
      super(params);
    }
    widgetFields = {
      widget: this.getWidget(),
      fileListDiv: this.getFileListDiv(),
      model: () => this._model,
      dragArea: this.getDragArea()
    };

    getWidget() {
      return this.element.querySelector(CustomFileInput.selectors.widget);
    }

    getDragArea() {
      return this.element.querySelector(CustomFileInput.selectors.dragArea);
    }

    getDescription() {
      return this.element.querySelector(CustomFileInput.selectors.description);
    }

    getLabel() {
      return this.element.querySelector(CustomFileInput.selectors.label);
    }

    getErrorDiv() {
      return this.element.querySelector(CustomFileInput.selectors.errorDiv);
    }

    getTooltipDiv() {
      return this.element.querySelector(CustomFileInput.selectors.tooltipDiv);
    }

    getQuestionMarkDiv() {
      return this.element.querySelector(CustomFileInput.selectors.qm);
    }

    getFileListDiv() {
      return this.element.querySelector(CustomFileInput.selectors.fileListDiv);
    }

    getAttachButtonLabel() {
      return this.element.querySelector(CustomFileInput.selectors.attachButtonLabel);
    }

    updateEnabled(enabled, state) {
      if (this.widget) {
        this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
        const isDisabled = !enabled || state.readOnly;
        if (isDisabled) {
          this.widget.setAttribute("disabled", "disabled");
          this.widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
        } else {
          this.widget.removeAttribute("disabled");
          this.widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
        }
      }
    }

    updateValue(value) {
      if (this.widgetObject == null) {
        this.widgetObject = new CustomFileInputWidget(this.widgetFields);
      }
      this.widgetObject.setValue(value);
      super.updateEmptyStatus();
    }

    setModel(model) {
      if (typeof this._model === "undefined" || this._model === null) {
        this._model = model;
      } else {
        throw "Re-initializing model is not permitted"
      }
      const state = this._model.getState();
      this.applyState(state);


      if (this.widgetObject == null){
        this.widgetObject = new CustomFileInputWidget(this.widgetFields);
      }
      this.getAttachButtonLabel().addEventListener('focus', () => {
        this.setActive();
      })
      this.getAttachButtonLabel().addEventListener('blur', () => {
        this.setInactive();
      })
    }



    syncWidget() {
      let widgetElement = this.getWidget ? this.getWidget() : null;
      if (widgetElement) {
        widgetElement.id = this.getId() + "__widget";
        const closestElement = widgetElement?.previousElementSibling;
        if (closestElement && closestElement.tagName.toLowerCase() === 'label') {
          closestElement.setAttribute('for', this.getId() + "__widget");
        } else {
          this.getAttachButtonLabel().removeAttribute('for');
        }
      }
    }
  }

  FormView.Utils.setupField(({element, formContainer}) => {
    return new CustomFileInput({element, formContainer})
  }, CustomFileInput.selectors.self);

})();
