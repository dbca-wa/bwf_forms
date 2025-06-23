/* 
  These types refer to the properties of the form controls in the form builder.
  Each type is a key in the object that represents the properties of a form control.
  The definition and props are in the store files, such as, data-props-store.js, validation-props-store.js, etc.
*/

export const CONTROL_PROPS_TYPES = {
  LABEL: 'label',
  LABEL_POSITION: 'labelPosition',
  PLACEHOLDER: 'placeholder',
  CUSTOM_CLASS: 'customClass',
  DESCRIPTION: 'description',
  TOOLTIP: 'tooltip',
  PREFIX: 'prefix',
  SUFFIX: 'suffix',
  TAB_INDEX: 'tabIndex',
  HIDDEN: 'hidden',
  DISABLED: 'disabled',
  CHECKED: 'checked',
  HIDE_LABEL: 'hideLabel',
  DISPLAY_MASK: 'displayMask',
  MAX_DATE: 'max',
  MIN_DATE: 'min',
  TEXTAREA_ROWS: 'rows',
  HTML_CONTENT: 'htmlContent',
  ACTION: 'action',
  SAVE_ON_ENTER: 'saveOnEnter',
  THEME: 'theme',
  SIZE: 'size',
  BLOCK_BUTTON: 'blockButton',
  LEFT_ICON: 'leftIcon',
  RIGHT_ICON: 'rightIcon',

  SIDE_BUTTONS: 'sideButtons',
  STEP: 'step',
};

export const DATE_PROPS_TYPES = {
  FORMAT: 'format',
  SHOW_SECONDS: 'showSeconds',
  SHOW_MILLISECONDS: 'showMilliseconds',
  DISPLAY_IN_TIMEZONE: 'displayInTimezone',
};
export const DATE_DATA_PROPS_TYPES = {
  DEFAULT_VALUE: 'defaultValue',
  DEFAULT_VALUE_END: 'defaultValueEnd',
  PLACEHOLDER_END: 'placeholderEnd',
  DISABLE_WEEKENDS: 'disableWeekends',
  DISABLE_WEEKDAYS: 'disableWeekdays',
  IS_DATE_RANGE: 'isDateRange',
  HOUR_FORMAT: 'hourFormat',
  ENABLE_DATE_INPUT: 'enableDateInput',
  ENABLE_TIME_INPUT: 'enableTimeInput',
};

export const FILE_DATA_PROPS_TYPES = {
  MULTIPLE_FILES: 'multipleFiles',
  FILE_FORMATS: 'fileFormats',
  FILE_TYPES: 'fileTypes',
  FILE_MIN_SIZE: 'fileMinSize',
  FILE_MAX_SIZE: 'fileMaxSize',
  DISPLAY_AS_IMAGES: 'displayAsImages',
};

export const CONTROL_DATA_PROPS_TYPES = {
  DATASOURCE: 'datasource',
  MULTI: 'multi',
  DEFAULT_VALUE: 'defaultValue',
  ITEM_TEMPLATE: 'itemTemplate',
};

export const CONTROL_API_PROPS_TYPES = {
  FIELD_NAME: 'fieldName',
  FIELD_NAME_DEFAULT: 'fieldNameDefault',
};

export const CONTROL_VALIDATION_PROPS_TYPES = {
  VALIDATE_ON: 'validateOn',
  REQUIRED: 'required',
  UNIQUE: 'unique',
  VALIDATE_HIDDEN: 'validateHidden',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  MIN_ITEMS: 'minItems',
  MAX_ITEMS: 'maxItems',
  MIN_WORD_LENGTH: 'minWordLength',
  MAX_WORD_LENGTH: 'maxWordLength',
  MIN_VALUE: 'minValue',
  MAX_VALUE: 'maxValue',
  REGEX: 'regex',
  ERROR_LABEL: 'errorLabel',
  ERROR_MESSAGE: 'errorMessage',
  MIN_DATE: 'minDate',
  MAX_DATE: 'maxDate',
  MIN_CHECKED: 'minChecked',
  MAX_CHECKED: 'maxChecked',
  MIN_CHECKED_ERROR_MESSAGE: 'minCheckedErrorMessage',
  MAX_CHECKED_ERROR_MESSAGE: 'maxCheckedErrorMessage',
};

export const DATASOURCE_PROPS_TYPES = {
  TYPE: 'type',
  URL: 'url',
  VALUES: 'values',
  RAW_JSON: 'rawJson',
  DEFAULT_VALUE: 'defaultValue',
  ID_PATH: 'idPath',
  VALUE_PROPERTY: 'valueProperty',
  JSON_VALUE: 'jsonValue',
};

export const LAYOUT_CONTROL_PROPS_TYPES = {
  COLUMNS: 'columns',
  AUTO_ADJUST_COLUMNS: 'autoAdjustColumns',
  DISPLAY_DIRECTION: 'displayDirection',
  TITLE: 'title',
  NUM_ROWS: 'numRows',
  NUM_COLS: 'numCols',

  HTML_CONTENT: 'htmlContent',
  TAG: 'tag',
  ATTRIBUTES: 'attributes',
};
