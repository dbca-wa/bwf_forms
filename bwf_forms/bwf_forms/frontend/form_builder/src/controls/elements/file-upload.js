import { formatFileSize, generateRandomId, markup, parseFileSize } from '../../js/utils';
import { CLASS_INVALID_FIELD_VALUE } from '../utils/constants';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  FILE_DATA_PROPS_TYPES,
} from '../utils/control-props-types';
import { ELEMENT_TYPES } from '../utils/element-types';
import InputElement from './input-element';
import { fileIcons } from '../../js/images.js';

const defaultSettings = {};

export default class FileUploadElement extends InputElement {
  files = [];
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
    this.elementType = ELEMENT_TYPES.FILE_UPLOAD;
    this.setup();
  }

  getElementValue() {
    const props = this.getPropsObject();
    const renderAsImage = props[FILE_DATA_PROPS_TYPES.DISPLAY_AS_IMAGES];
    const fileTypes = props[FILE_DATA_PROPS_TYPES.FILE_TYPES] ?? [];
    const isMultipleFiles = this.files.length > 1;
    const _filesValues = this.files.map((fileData) => {
      const fileExt = fileData.name.split('.').pop().toLowerCase();

      return markup(
        'row',
        [
          {
            tag: 'div',
            content: [
              renderAsImage && fileData.type.startsWith('image/')
                ? { tag: 'img', src: fileData.base64, class: 'img-preview' }
                : // : { tag: 'i', class: `bi bi-filetype-${fileExt}` },
                  { tag: 'img', src: fileIcons[fileExt], style: 'width: 25px; height: 25px;' },

              { tag: 'span', content: fileData.name, class: 'ms-3' },
              {
                tag: 'span',
                content: fileTypes ? fileTypes.find((type) => type.value === fileData.fileType)?.label : '',
                class: 'ms-3',
              },
            ],
            class: 'd-flex col-xs-12 col-md-8 align-self-center gx-2',
          },
        ],
        {
          id: fileData.id,
          class: ['d-flex text-body-secondary py-2', isMultipleFiles ? ' border-bottom' : ''].join(' '),
        },
      );
    });
    return this.files.length ? _filesValues : 'No files selected';
  }

  getFieldValue() {
    if (!this.apiControlProps) return {};
    const props = this.getPropsObject();
    let values = [];
    if (props[FILE_DATA_PROPS_TYPES.FILE_TYPES]) {
      values = this.files.map((file) => {
        return {
          [file.fileType]: file,
        };
      });
    } else {
      values = this.files;
    }

    return {
      [props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]: values,
    };
  }
  validateValue() {
    const props = this.getPropsObject();

    const errors = [];
    let errorMessage = '';
    if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] && this.files.length === 0) {
      errors.push('You must upload at least one file');
    }
    if (props[FILE_DATA_PROPS_TYPES.FILE_TYPES] && this.files.some((file) => !file.fileType)) {
      errors.push('Select a file type for each file');
    }
    if (errors.length > 0) {
      errorMessage = props[CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE] || errors.join(', ');
    }
    $(this.getIdSelector()).parent().find(`.${CLASS_INVALID_FIELD_VALUE}`).text(errorMessage);

    return errors.length === 0;
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    this.modifyProps(props);
    const value = props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
    const attributes = {
      id: props.id ?? this.id,
      type: this.type,
      hidden: true,
    };

    if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) attributes.required = true;

    if (props[CONTROL_PROPS_TYPES.DISABLED]) attributes.disabled = true;

    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.label.required = props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] === true;
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];
    const isMultipleFiles = props[FILE_DATA_PROPS_TYPES.MULTIPLE_FILES];
    let accept = '';
    if (props[FILE_DATA_PROPS_TYPES.FILE_FORMATS]) {
      if (!Array.isArray(props[FILE_DATA_PROPS_TYPES.FILE_FORMATS])) {
        accept = props[FILE_DATA_PROPS_TYPES.FILE_FORMATS];
      } else {
        accept = props[FILE_DATA_PROPS_TYPES.FILE_FORMATS].join(',');
      }
    }
    const isDisabled = props[CONTROL_PROPS_TYPES.DISABLED];
    const message = isMultipleFiles ? 'Drop files here or' : 'Drop a file here or';
    const content = [
      super.render(props, { hidden: true, ...(isMultipleFiles ? { multiple: true } : {}), accept }),
      markup(
        'div',
        [
          { tag: 'i', class: 'bi bi-cloud-arrow-up-fill' },
          { tag: 'span', content: `&nbsp;${message}&nbsp` },
          {
            tag: 'a',
            class: isDisabled ? 'pe-none' : '',
            content: 'click to browse.',
            href: '#',
          },
        ],
        { class: 'file-selector' },
      ),
      markup('div', '', { class: CLASS_INVALID_FIELD_VALUE }),
      markup('div', [], { class: 'files-list', style: 'display: none;' }),
    ];

    return markup('div', content, {
      id: this.id + '-container',
      class: ['filecontainer', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '', 'py-2'].join(' '),
    });
  }

  renderTest() {
    this.files.splice(0, this.files.length);
    const file = {
      id: 'test-file',
      name: 'test.pdf',
      size: 12345,
      type: 'application/pdf',
      base64: 'data:application/pdf;base64,',
    };
    this.files.push(file);
    this.renderFile(file);
  }

  afterRender() {
    if (!this.$p) {
      console.error('Element not rendered');
      return;
    }
    if (this.files.length > 0) {
      this.files.forEach((file) => this.renderFile(file));
    }
    // this.renderTest();
    const container = `#${this.id}-container`;
    $(`${container} a`).on('click', this, (e) => document.getElementById(this.id).click());
    $(`${container} input[type="file"]`).on('change', this, this.handleFileInputChange.bind(this));

    const fileSelector = $(`${container} .file-selector`);

    fileSelector.on('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).addClass('dragover');
    });
    fileSelector.on('dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    fileSelector.on('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).removeClass('dragover');
    });
    fileSelector.on('drop', this, function (e) {
      const _this = e.data;
      e.preventDefault();
      e.stopPropagation();
      $(this).removeClass('dragover');
      const ev = e.originalEvent;
      if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item, i) => {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            _this.processFile(file);
          }
        });
      } else {
        [...ev.dataTransfer.files].forEach((file, i) => {
          _this.processFile(file);
        });
      }
    });
  }

  handleFileInputChange(e) {
    const files = $(e.target).prop('files');
    if (!files || files.length === 0) return;
    for (const file of files) {
      this.processFile(file);
    }
  }

  processFile(file) {
    const _this = this;
    const props = this.dataControlProps.getPropsValues();
    if (props[CONTROL_PROPS_TYPES.DISABLED]) return;
    try {
      const fileData = {
        id: _this.id + '-file-' + generateRandomId(),
        name: file.name,
        size: file.size,
        type: file.type,
        fileType: '',
      };
      const parsedMaxSize = parseFileSize(props[FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE]);
      const parsedMinSize = parseFileSize(props[FILE_DATA_PROPS_TYPES.FILE_MIN_SIZE]);
      if (parsedMaxSize && file.size > parsedMaxSize) {
        return alert(
          'File size exceeds the maximum allowed: ' + props[FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE].toUpperCase(),
        );
      }
      if (parsedMinSize && file.size < parsedMinSize) {
        return alert('File must be larger than ' + props[FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE].toUpperCase());
      }
      if (!props[FILE_DATA_PROPS_TYPES.MULTIPLE_FILES]) {
        _this.files = [];
        $(`#${this.id}-container .files-list`).empty();
        $(`#${this.id}-container .file-selector`).hide();
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        const base64String = event.target.result;
        fileData.base64 = base64String;
        _this.files.push(fileData);
        _this.renderFile(fileData);

        _this.validateValue();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file', error);
    }
  }

  renderFile(fileData) {
    const props = this.dataControlProps.getPropsValues();
    const fileExt = fileData.name.split('.').pop().toLowerCase();

    const renderAsImage = props[FILE_DATA_PROPS_TYPES.DISPLAY_AS_IMAGES] && fileData.type.startsWith('image/');
    const isMultipleFiles = props[FILE_DATA_PROPS_TYPES.MULTIPLE_FILES];
    const fileElement = markup(
      'div',
      [
        {
          tag: 'div',
          content: [
            renderAsImage
              ? { tag: 'img', src: fileData.base64, class: 'img-preview' }
              : // : { tag: 'i', class: `bi bi-filetype-${fileExt}` },
                { tag: 'img', src: fileIcons[fileExt], style: 'width: 25px; height: 25px;' },

            { tag: 'span', content: fileData.name, class: 'ms-3' },
          ],
          class: 'd-flex col-xs-12 col-md-8 align-self-center gx-2',
        },
        {
          tag: 'div',
          content: [
            this.renderFileTypeSelect(fileData.id),
            {
              tag: 'span',
              content: `${formatFileSize(fileData.size)}`,
              class: 'col align-self-center text-center form-text',
            },
            {
              tag: 'button',
              // content: { tag: 'i', class: 'bi bi-trash' },
              content: 'Delete',
              class: 'btn btn-sm  btn-danger flex-shrink-0 me-2',
              'data-file-id': fileData.id,
            },
          ],
          class: 'd-flex col-sm-xs col-md-4 align-self-center gx-2',
        },
      ],
      {
        id: fileData.id,
        class: ['d-flex text-body-secondary py-2', isMultipleFiles ? ' border-bottom' : ''].join(' '),
      },
    );
    if (!isMultipleFiles) $(`#${this.id}-container .files-list`).addClass('p-2 border border-light');
    $(`#${this.id}-container .files-list`).show().append(fileElement);
    $(`#${fileData.id} button`).on('click', this, function (e) {
      const _this = e.data;
      const fileId = $(this).data('file-id');
      _this.files = _this.files.filter((f) => f.id !== fileId);
      $(`#${fileData.id}`).remove();
      $(`#${_this.id}-container .files-list`).removeClass('p-2 border border-light');

      $(`#${_this.id}-container .file-selector`).show();
    });
    $(`#${fileData.id} select`).on('change', this, function (e) {
      const _this = e.data;
      const fileId = $(this).data('file-id');
      const file = _this.files.find((f) => f.id === fileId);
      if (file) file.fileType = $(this).val();
    });
  }

  renderFileTypeSelect(fileId) {
    const props = this.dataControlProps.getPropsValues();
    const types = props[FILE_DATA_PROPS_TYPES.FILE_TYPES] || [];
    const options = [{ tag: 'option', content: '', value: '' }];
    options.push(types.map((fileType) => markup('option', fileType.label, { value: fileType.value })));
    if (types.length === 0) {
      return '';
    }
    return markup('select', options, {
      id: this.id + '-file-type',
      class: 'form-select form-select-sm col',
      'data-file-id': fileId,
    });
  }
}
