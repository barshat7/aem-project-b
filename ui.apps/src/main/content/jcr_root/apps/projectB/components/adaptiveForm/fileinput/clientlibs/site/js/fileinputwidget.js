if (typeof window.CustomFileInputWidget === 'undefined') {
  window.CustomFileInputWidget = class extends FormView.FormFileInputWidget {

    constructor(params) {
      super(params);
      this.dragArea = params.dragArea;
      this.fileSet = [];
      this.elementToFocusAfterDelete = null;
    }

    attachEventHandlers(widget, dragArea, model) {
      super.attachEventHandlers(widget, model)
      dragArea?.addEventListener("dragover", (event)=>{
        event.preventDefault();
        dragArea.classList.add("cmp-adaptiveform-fileinput__dragarea--active");
      });
      dragArea?.addEventListener("dragleave", (event)=>{
        dragArea.classList.remove("cmp-adaptiveform-fileinput__dragarea--active");
      });
      dragArea?.addEventListener("drop", (event)=>{
        event.preventDefault();
        dragArea.classList.remove("cmp-adaptiveform-fileinput__dragarea--active");
        this.handleChange(event?.dataTransfer?.files);
      });
      dragArea?.addEventListener("paste", (event)=>{
        event.preventDefault();
        this.handleChange(event?.clipboardData?.files);
      });

      const customBtn = dragArea?.querySelector(".cmp-adaptiveform-fileinput__widgetlabel")

      customBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        widget.click();
      });
      customBtn?.addEventListener('keypress', function(event) {
        // Check if the Enter key is pressed
        if (event.key === 'Enter' || event.keyCode === 13) {
          // Trigger the click event of the file input
          event.preventDefault();
          widget.click();
        }
      });
    }
    /**
     * This event listener gets called on click of close button in file upload
     *
     * @param event
     */
    handleClick (event){
      let elem = event.target,
          text = elem.parentElement.previousSibling.textContent,
          index = this.getIndexOfText(text, elem),
          url = elem.parentElement.previousSibling.dataset.key,
          objectUrl = elem.parentElement.previousSibling.dataset.objectUrl;

      const fileToDelete = elem.getAttribute('data-custom-filename');
        for (let i = 1; i < this.fileSet.length; i++) {
          if (this.fileSet[i] == fileToDelete) {
            this.elementToFocusAfterDelete = this.fileSet[i-1];
          }
	    }
      if (index !== -1) {
        this.values.splice(index, 1);
        this.fileArr.splice(index, 1);
        // set the model with the new value
        this.model.value = this.fileArr;
        // value and fileArr contains items of both URL and file types, hence while removing from DOM
        // get the correct index as per this.#widget.files
        let domIndex = Array.from(this.widget.files).findIndex(function(file) {
          return file.name === text;
        });
        this.deleteFilesFromInputDom([domIndex]);
        if (url != null) {
          // remove the data so that others don't use this url
          delete elem.parentElement.previousSibling.dataset.key;
        }
        if(objectUrl) {
          // revoke the object URL to avoid memory leaks in browser
          // since file is anyways getting deleted, remove the object URL's too
          window.URL.revokeObjectURL(objectUrl);
        }
      }
      // Remove the dom from view
      //All bound events and jQuery data associated with the element are also removed
      elem.parentElement.parentElement.remove();
      // Set the focus on file upload button after click of close and no other file is present
      if (this.fileList && this.fileList.children && this.fileList.children.length==0) {
        this.dragArea.querySelector(".cmp-adaptiveform-fileinput__widgetlabel").focus()
      }
    }

    formatBytes(bytes, decimals = 0) {
      if (!+bytes) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb']
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    setValue(value) {
      let isValueSame = false;
      if (value != null) {
        // change to array since we store array internally
        value = Array.isArray(value) ? value : [value];
      }
      // check if current values and new values are same
      if (this.fileArr != null && value != null) {
        isValueSame = JSON.stringify(FormView.FileAttachmentUtils.extractFileInfo(this.fileArr)) === JSON.stringify(value);
      }
      // if new values, update the DOM
      if (!isValueSame) {
        let oldUrls = {};
        // Cache the url before deletion
        this.fileList.querySelectorAll(".cmp-adaptiveform-fileinput__filename").forEach(function (elem) {
          let url = elem.dataset.key;
          if (typeof url !== "undefined") {
            let fileName = url.substring(url.lastIndexOf("/") + 1);
            oldUrls[fileName] = url;
          }
        });
        // empty the file list
        while (this.fileList.lastElementChild) {
          this.fileList.removeChild(this.fileList.lastElementChild);
        }
        // set the new value
        console.log('setValue called.')
        if (value != null) {
          console.log('setValue inside value != null check', value)
          let self = this;
          // Update the value array with the file
          this.values = value.map(function (file, index) {
            // Check if file Name is a path, if yes get the last part after "/"
            let isFileObject= window.File ? file.data instanceof window.File : false,
                fileName = typeof file === "string" ? file : file.name,
                fileUrl = typeof file === "string" ? file : (isFileObject ? "" : file.data),
                fileSize = file.size,
                fileUploadUrl = fileUrl;
            if (oldUrls[fileName]) {
              fileUploadUrl = oldUrls[fileName];
            }
            self.showFileList(fileName, fileSize, null, fileUploadUrl);
            return fileName;
          });
          this.fileArr = [...value];
        }
      }
    }


    handleFilePreview (event){
      let elem = event.target,
          text = elem.textContent,
          index = this.getIndexOfText(text, elem),
          fileDom = null,
          fileName = null,
          fileUrl = null;

      // for draft usecase, if text contains "/" in it, it means the file is already uploaded
      // text should contain the path, assuming that the fileUrl is stored in data element
      if (index !== -1) {
        // Store the url of file as data
        if(typeof elem.dataset.key !== "undefined")
          fileUrl = elem.dataset.key;

        if(fileUrl)  {
          //prepend context path if not already appended
          if (!(fileUrl.lastIndexOf(this.options.contextPath, 0) === 0)) {
            fileUrl =  this.options.contextPath + fileUrl;
          }
          FormView.FormFileInputWidget.previewFile.apply(this, [null, {"fileUrl" : fileUrl}]);
        } else {
          // todo: add support here
          //let previewFileObjIdx = this._getFileObjIdx(index);
          let previewFile = this.fileArr[index]?.data;
          let objectUrl = FormView.FormFileInputWidget.previewFileUsingObjectUrl(previewFile);
          if (objectUrl) {
            elem.dataset.objectUrl = objectUrl;
          }
        }
      }
    }

    fileItem(fileName, fileSize, comment, fileUrl) {
      console.log('fileitem')
      let self = this;
      let id = `${Date.now() + '_' + Math.floor(Math.random() * 10000)}_file_size`
      let fileItem = document.createElement('li');
      fileItem.setAttribute("class", "cmp-adaptiveform-fileinput__fileitem");
      let fileNameDom = document.createElement('a');
      let fileSizeDom = document.createElement('span');

      fileSizeDom.setAttribute('class', "cmp-adaptiveform-fileinput__filesize");
      fileSizeDom.setAttribute('id', id);
      fileSizeDom.textContent = this.formatBytes(fileSize);

      fileNameDom.setAttribute('tabindex', '0');
      fileNameDom.setAttribute('class', "cmp-adaptiveform-fileinput__filename");
      fileNameDom.setAttribute('aria-describedBY', id);
      fileNameDom.textContent = fileName;
      fileNameDom.addEventListener('keypress', function(e) {
        if (e.keyCode === 13 || e.charCode === 32) {
          e.target.click();
        }
      });
      fileNameDom.addEventListener('click', function(e) {
        self.handleFilePreview(e);
      });
      fileItem.appendChild(fileNameDom);
      if(fileUrl != null){
        fileNameDom.dataset.key = fileUrl;
      }
      let fileEndContainer = document.createElement('span');
      let fileClose = document.createElement('button');
      fileEndContainer.setAttribute('class', "cmp-adaptiveform-fileinput__fileendcontainer");
      fileClose.setAttribute('tabindex', '0');
      fileClose.setAttribute('class', "cmp-adaptiveform-fileinput__filedelete");
      fileClose.setAttribute('aria-label', "Delete " + fileName);
      fileClose.textContent = "x";
      fileClose.addEventListener('keypress', function(e) {
        if (e.keyCode === 13 || e.charCode === 32) {
          e.target.click();
        }
      });
      fileClose.addEventListener('click', function(e) {
        self.handleClick(e);
      });
      fileEndContainer.appendChild(fileSizeDom);
      fileEndContainer.appendChild(fileClose);
      fileItem.appendChild(fileEndContainer);
      return fileItem;
    }


    handleChange(filesUploaded) {
      if (!this.isFileUpdate) {
        let currFileName = '',
            inValidSizefileNames = '',
            inValidNamefileNames = '',
            inValidMimeTypefileNames = '',
            self = this,
            files = filesUploaded;
        // Initially set the invalid flag to false
        let isInvalidSize = false,
            isInvalidFileName = false,
            isInvalidMimeType = false;
        //this.resetIfNotMultiSelect();
        if (typeof files !== "undefined") {
          let invalidFilesIndexes = [];
          Array.from(files).forEach(function (file, fileIndex) {
            let isCurrentInvalidFileSize = false,
                isCurrentInvalidFileName = false,
                isCurrentInvalidMimeType = false;
            currFileName = file.name.split("\\").pop();
            // Now size is in MB
            let size = file.size / 1024 / 1024;
            // check if file size limit is within limits
            if ((size > parseFloat(this.options.maxFileSize))) {
              isInvalidSize = isCurrentInvalidFileSize = true;
              inValidSizefileNames = currFileName + "," + inValidSizefileNames;
            } else if (!FormView.FormFileInputWidget.isValid(currFileName)) {
              // check if file names are valid (ie) there are no control characters in file names
              isInvalidFileName = isCurrentInvalidFileName = true;
              inValidNamefileNames = currFileName + "," + inValidNamefileNames;
            } else {
              let isMatch = false;
              let extension = currFileName.split('.').pop();
              let mimeType = (file.type) ? file.type : self.extensionToMimeTypeMap[extension];
              if (mimeType != undefined && mimeType.trim().length > 0) {
                isMatch = this.regexMimeTypeList.some(function (rx) {
                  return rx.test(mimeType);
                });
              }
              if (!isMatch) {
                isInvalidMimeType = isCurrentInvalidMimeType = true;
                inValidMimeTypefileNames = currFileName + "," + inValidMimeTypefileNames;
              }
            }

            // if the file is not invalid, show it and push it to internal array
            if (!isCurrentInvalidFileSize && !isCurrentInvalidFileName && !isCurrentInvalidMimeType) {
              this.showFileList(currFileName);
              if(this.isMultiSelect()) {
                this.values.push(currFileName);
                this.fileArr.push(file);
              } else {
                this.values = [currFileName];
                this.fileArr = [file];
              }
            } else {
              invalidFilesIndexes.push(fileIndex);
            }


          }, this);

          if (invalidFilesIndexes.length > 0 && this.widget !== null) {
            this.deleteFilesFromInputDom(invalidFilesIndexes);
          }
        }

        // set the new model value.
        this.model.value = this.fileArr;

        if (isInvalidSize) {
          this.showInvalidMessage(inValidSizefileNames.substring(0, inValidSizefileNames.lastIndexOf(',')), this.invalidFeature.SIZE);
        } else if (isInvalidFileName) {
          this.showInvalidMessage(inValidNamefileNames.substring(0, inValidNamefileNames.lastIndexOf(',')), this.invalidFeature.NAME);
        } else if (isInvalidMimeType) {
          this.showInvalidMessage(inValidMimeTypefileNames.substring(0, inValidMimeTypefileNames.lastIndexOf(',')), this.invalidFeature.MIMETYPE);
        }
      }
      this.widget.value = null;
    }

    invalidMessage(fileName, invalidFeature){
      // todo: have add localization here

      if(invalidFeature === this.invalidFeature.SIZE) {
        alert("File(s) " + fileName +  " are greater than the expected size: " + this.options.maxFileSize);
      } else if (invalidFeature === this.invalidFeature.NAME) {
        alert('Do not attach files where filename starts with (.), contains \ / : * ? " < > | ; % $, or is a reserved keyword like nul, prn, con, lpt, or com.');
      } else if (invalidFeature === this.invalidFeature.MIMETYPE) {
        alert("File(s) " + fileName + " are unsupported file types");
      }
    }

    showFileList(fileName, fileSize, comment, fileUrl) {
     
      if(!this.isMultiSelect() || fileName === null || typeof fileName === "undefined") {
        // if not multiselect, remove all the children of file list
        while (this.fileList.lastElementChild) {
          this.fileList.removeChild(this.fileList.lastElementChild);
        }
      }

      // Add the file item
      // On click of close, remove the element and update the model
      // handle on click of preview button

      if(fileName != null) {
        var fItem =this.fileItem(fileName, fileSize, comment, fileUrl);
        this.fileList.appendChild(fItem);
      }

      if (this.elementToFocusAfterDelete) {
        const selector = 'button[data-custom-filename=' + '"' + this.elementToFocusAfterDelete + '"]';
      	const fieldToFocus = document.querySelector(selector);
        if (fieldToFocus) {
        	fieldToFocus.focus();
        } 
      }  
    }
  }
}
