import { ELEMENT_CATEGORIES_TYPES } from './utils/element-categories';
import { ELEMENT_TYPES } from './utils/element-types';
import { LAYOUT_TYPES } from './utils/layout-types';

export const FORM_CONTROLS = {
  [ELEMENT_CATEGORIES_TYPES.ELEMENT]: [
    {
      label: 'Input Text',
      type: ELEMENT_TYPES.INPUT,
      icon: 'bi bi-type',
    },
    {
      label: 'Number',
      type: ELEMENT_TYPES.INPUT_NUMBER,
      icon: 'bi bi-hash',
    },
    {
      label: 'Date Picker',
      type: ELEMENT_TYPES.DATE_PICKER_JQ,
      icon: 'bi bi-calendar-date',
    },
    {
      label: 'Mobile Number',
      type: ELEMENT_TYPES.MOBILE_NUMBER,
      icon: 'bi bi-phone',
    },

    {
      label: 'Text Area',
      type: ELEMENT_TYPES.TEXT_AREA,
      icon: 'bi bi-alphabet',
    },
    {
      label: 'Email',
      type: ELEMENT_TYPES.EMAIL,
      icon: 'bi bi-at',
    },
    { label: 'Password', type: ELEMENT_TYPES.PASSWORD, icon: 'bi bi-key-fill' },
    {
      label: 'File Upload',
      type: ELEMENT_TYPES.FILE_UPLOAD,
      icon: 'bi bi-file-earmark-arrow-up',
    },
  ],
  [ELEMENT_CATEGORIES_TYPES.MULTIPLE_CHOICE]: [
    {
      label: 'Select',
      type: ELEMENT_TYPES.SELECT,
      icon: 'bi bi-justify',
    },
    {
      label: 'Checkbox',
      type: ELEMENT_TYPES.CHECK_BOX,
      icon: 'bi bi-check-square',
    },
    {
      label: 'Select Boxes',
      type: ELEMENT_TYPES.SELECT_BOXES,
      icon: 'bi bi-ui-checks',
    },
    {
      label: 'Radio Button',
      type: ELEMENT_TYPES.RADIO,
      icon: 'bi bi-ui-radios',
    },
  ],
  [ELEMENT_CATEGORIES_TYPES.LAYOUT]: [
    {
      label: 'HTML',
      type: LAYOUT_TYPES.HTML_CONTENT,
      icon: 'bi bi-code',
    },
    {
      label: 'Button',
      type: ELEMENT_TYPES.BUTTON,
      icon: 'bi bi-cursor-fill',
    },
    {
      label: 'Columns',
      type: LAYOUT_TYPES.ROW_COLUMNS,
      icon: 'bi bi-layout-split',
    },
    {
      label: 'Container',
      type: LAYOUT_TYPES.CONTAINER,
      icon: 'bi bi-columns',
    },
  ],
  [ELEMENT_CATEGORIES_TYPES.DATA]: [
    {
      label: 'Edit Grid',
      type: LAYOUT_TYPES.EDIT_GRID,
      icon: 'bi bi-layout-three-columns',
    },
    {
      label: 'Section',
      type: LAYOUT_TYPES.SECTION,
      icon: 'bi bi-layout-split',
    },
  ],
};
