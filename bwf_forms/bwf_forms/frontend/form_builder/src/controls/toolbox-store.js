import InputElement from './elements/input-element';
import SelectElement from './elements/select-element';
import { ELEMENT_TYPES } from './utils/element-types';
import RadioButton from './elements/radio-button';
import { INPUT_TYPES } from './utils/input-types';
import { LAYOUT_TYPES } from './utils/layout-types';
import TextAreaElement from './elements/textarea';
import SelectBoxes from './elements/select-boxes';
import { HTMLComponent } from './layout/html-component';
import ButtonElement from './elements/button-element';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
} from './utils/control-props-types';
import { RowBlock } from './layout/row-block';
import { DropableControl } from './layout/dropable-control';
import { ContainerBlock } from './layout/container-component';
import DatePicker from './elements/jquery/date-picker';
import FileUploadElement from './elements/file-upload';
import { EditableGrid } from './layout/editable-grid';
import { EditableDropableControl } from './layout/editable-dropable-control';
import { SectionComponent } from './layout/section-component';

export const CONTROLS_STORE = {
  [ELEMENT_TYPES.INPUT]: {
    description: 'A simple input control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Text Field',
      [CONTROL_PROPS_TYPES.LABEL]: 'Text Field',
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: '',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
      type: INPUT_TYPES.TEXT,
      minWordLength: 1,
      maxWordLength: 2,
    },
    attr: {
      type: INPUT_TYPES.TEXT,
    },
    icon: 'fa fa-font',
    controlClass: () => InputElement,
  },
  [ELEMENT_TYPES.FILE_UPLOAD]: {
    description: 'A simple file upload control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'File Upload',
      [CONTROL_PROPS_TYPES.LABEL]: 'Upload a file',
      type: INPUT_TYPES.FILE_UPLOAD,
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => FileUploadElement,
  },
  [ELEMENT_TYPES.MOBILE_NUMBER]: {
    description: 'A simple mobile number control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Mobile Number',
      [CONTROL_PROPS_TYPES.LABEL]: 'Mobile Number',
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: '',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
      type: INPUT_TYPES.MOBILE_NUMBER,
      [CONTROL_PROPS_TYPES.DISPLAY_MASK]: '(0000) 000 000',
    },
    attr: {
      type: INPUT_TYPES.MOBILE_NUMBER,
    },
    icon: 'fa fa-font',
    controlClass: () => InputElement,
  },
  [ELEMENT_TYPES.INPUT_NUMBER]: {
    description: 'A simple number control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Input Number',
      [CONTROL_PROPS_TYPES.LABEL]: 'Enter a number',
      type: INPUT_TYPES.NUMBER,
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a number',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
      [CONTROL_VALIDATION_PROPS_TYPES.MIN_VALUE]: 5,
    },

    attr: {
      type: INPUT_TYPES.NUMBER,
    },
    icon: 'fa fa-font',
    controlClass: () => InputElement,
  },
  [ELEMENT_TYPES.SELECT]: {
    description: 'A simple select control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Select Control',
      [CONTROL_PROPS_TYPES.LABEL]: 'Select an option',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
      values: [
        { text: 'Select Option 1', value: 'option1' },
        { text: 'Select Option 2', value: 'option2' },
      ],
    },
    attr: {
      type: INPUT_TYPES.SELECT,
    },
    icon: 'fa fa-font',
    controlClass: () => SelectElement,
  },
  [ELEMENT_TYPES.CHECK_BOX]: {
    description: 'A simple checkbox control',
    props: {
      [CONTROL_PROPS_TYPES.LABEL]: 'Checkbox',
      type: INPUT_TYPES.CHECK_BOX,
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Checkbox Control',
    },
    attr: {
      type: INPUT_TYPES.CHECK_BOX,
    },
    icon: 'fa fa-font',
    controlClass: () => InputElement,
  },
  [ELEMENT_TYPES.SELECT_BOXES]: {
    description: 'A simple select boxes control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Select Boxes',
      [CONTROL_PROPS_TYPES.LABEL]: 'Select Boxes',
      type: INPUT_TYPES.SELECT_BOXES,
      values: [
        { text: 'Select Box 1', value: 'select-box-1' },
        { text: 'Select Box 2', value: 'select-box-2' },
      ],
    },
    attr: {
      type: INPUT_TYPES.SELECT_BOXES,
    },
    icon: 'fa fa-font',
    controlClass: () => SelectBoxes,
  },
  [ELEMENT_TYPES.RADIO]: {
    description: 'A simple radio control',
    props: {
      [CONTROL_PROPS_TYPES.LABEL]: 'Radio',
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Radio Control',
      values: [
        { text: 'Option 1', value: 'opt-1' },
        { text: 'Option 2', value: 'opt-2' },
      ],
      labelClass: 'form-check-label',
    },
    [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Radio Control',
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => RadioButton,
  },
};

export const SPECIAL_INPUT_STORE = {
  [ELEMENT_TYPES.DATE_PICKER_JQ]: {
    description: 'A simple date control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Date Picker',
      [CONTROL_PROPS_TYPES.LABEL]: 'Select a date',
      type: INPUT_TYPES.TEXT,
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Select a date',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => DatePicker,
  },
  [ELEMENT_TYPES.TIME_PICKER]: {
    description: 'A simple time control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Time Picker',
      [CONTROL_PROPS_TYPES.LABEL]: 'Select a time',
      type: INPUT_TYPES.TIME,
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Select a time',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
    },
    attr: {
      type: INPUT_TYPES.TEXT,
    },
    icon: 'fa fa-font',
    controlClass: () => InputElement,
  },
  [ELEMENT_TYPES.PASSWORD]: {
    description: 'A simple password control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Password Field',
      [CONTROL_PROPS_TYPES.LABEL]: 'Enter a password',
      type: INPUT_TYPES.PASSWORD,
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a password',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
    },
    attr: {
      type: INPUT_TYPES.PASSWORD,
    },
    icon: 'fa fa-font',
    controlClass: () => InputElement,
  },
  [ELEMENT_TYPES.EMAIL]: {
    description: 'A simple email control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Email Field',
      [CONTROL_PROPS_TYPES.LABEL]: 'Enter an email',
      type: INPUT_TYPES.EMAIL,
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter an email',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
    },
    attr: {
      // type: INPUT_TYPES.EMAIL,
    },
    icon: 'fa fa-font',
    controlClass: () => InputElement,
  },
  [ELEMENT_TYPES.TEXT_AREA]: {
    description: 'A simple text area control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Text Area',
      [CONTROL_PROPS_TYPES.LABEL]: 'Enter some text',
      type: INPUT_TYPES.TEXT_AREA,
      [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter some text',
      [CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]: true,
    },
    attr: {
      type: INPUT_TYPES.TEXT_AREA,
    },
    icon: 'fa fa-font',
    controlClass: () => TextAreaElement,
  },
  [ELEMENT_TYPES.BUTTON]: {
    description: 'A simple button control',
    props: {
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Button',
      [CONTROL_PROPS_TYPES.LABEL]: 'Click me',
      size: 'btn-lg',
      blockButton: true,
      action: 'submit',
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => ButtonElement,
  },
};

export const LAYOUT_STORE = {
  [LAYOUT_TYPES.DROPABLE]: {
    description: 'A dropable control',
    props: {},
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => DropableControl,
  },
  [LAYOUT_TYPES.EDIT_DROPABLE]: {
    description: 'A dropable control for editing',

    props: {},
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => EditableDropableControl,
  },

  [LAYOUT_TYPES.ROW_COLUMNS]: {
    description: 'A row with columns',
    props: {
      [CONTROL_PROPS_TYPES.LABEL]: 'Columns displayed',
      columns: [
        {
          size: 'md',
          width: 6,
        },
        {
          size: 'md',
          width: 6,
        },
      ],
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => RowBlock,
  },
  [LAYOUT_TYPES.CONTAINER]: {
    description: 'A container',
    props: {
      [CONTROL_PROPS_TYPES.LABEL]: 'Container',
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => ContainerBlock,
  },
  [LAYOUT_TYPES.HTML_CONTENT]: {
    description: 'A block of custom HTML code',
    props: {
      [CONTROL_PROPS_TYPES.LABEL]: 'HTML',
      tag: 'p',
      htmlContent: 'Custom HTML',
    },
    [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'HTML Component',
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => HTMLComponent,
  },
};

export const DATA_STORE = {
  [LAYOUT_TYPES.EDIT_GRID]: {
    description: 'A grid for editing',
    props: {
      [CONTROL_PROPS_TYPES.LABEL]: 'Editable Grid',
      [CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT]: 'Table',
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => EditableGrid,
  },
  [LAYOUT_TYPES.SECTION]: {
    description: 'A section',
    props: {
      [CONTROL_PROPS_TYPES.LABEL]: 'Section',
    },
    attr: {},
    icon: 'fa fa-font',
    controlClass: () => SectionComponent,
  },
};

export const BUILDER_TOOLBOX = Object.assign({}, CONTROLS_STORE, SPECIAL_INPUT_STORE, LAYOUT_STORE, DATA_STORE);

export const getControlFromToolbox = (type) => {
  try {
    return BUILDER_TOOLBOX[type];
  } catch (error) {
    console.error('Error in getControlFromToolbox', error);
    return {};
  }
};
