import {
  CONTROL_DATA_PROPS_TYPES,
  DATASOURCE_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
} from '../../utils/control-props-types';

const DEFAULT_DEFAULT_VALUE_PROPS = {
  name: 'defaultValue',
  title: 'Default Value',
  type: 'string',
  placeholder: 'Enter a default value',
  required: false,
  options: undefined,
  value: '',
  addEmptyOption: true,
};

export const DATASOURCE_VALUES = {
  VALUES: 'values',
  URL: 'url',
  RAW_JSON: 'rawJson',
};

export const dataPropertiesStore = {
  [CONTROL_DATA_PROPS_TYPES.DATASOURCE]: {
    name: 'dataSource',
    title: 'Data Source',
    type: 'select',
    placeholder: 'Select a data source',
    required: true,
    options: [
      { text: 'Values', value: DATASOURCE_VALUES.VALUES },
      { text: 'URL', value: DATASOURCE_VALUES.URL },
      { text: 'Raw JSON', value: DATASOURCE_VALUES.RAW_JSON },
    ],
    value: 'rawJson',
  },
  [CONTROL_DATA_PROPS_TYPES.MULTI]: {
    name: 'multipleValues',
    title: 'Multiple Values',
    type: 'boolean',
    placeholder: 'Multiple Values',
    required: false,
    options: undefined,
    value: false,
  },
  [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: { ...DEFAULT_DEFAULT_VALUE_PROPS },
};

export const datasourceDataPropertiesStore = {
  [DATASOURCE_VALUES.VALUES]: {
    [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: { ...DEFAULT_DEFAULT_VALUE_PROPS, type: 'select', options: [] },
    [DATASOURCE_PROPS_TYPES.VALUES]: {
      name: 'values',
      title: 'Enter Values',
      placeholder: 'Enter values',
      type: 'array',
      props: {
        sortable: true,
        structure: {
          value: {
            name: 'value',
            title: 'Value',
            type: 'string',
            placeholder: 'Enter a value',
            required: true,
            options: undefined,
            value: '',
          },
          text: {
            name: 'text',
            title: 'Text',
            type: 'string',
            placeholder: 'Enter a text',
            required: true,
            options: undefined,
            value: '',
          },
        },
      },
      required: true,
      options: undefined,
      value: '',
    },
  },
  [DATASOURCE_VALUES.URL]: {
    [DATASOURCE_PROPS_TYPES.URL]: {
      name: 'url',
      title: 'URL',
      type: 'string',
      placeholder: 'Enter a URL',
      required: true,
      options: undefined,
      value: '',
    },
    [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: { ...DEFAULT_DEFAULT_VALUE_PROPS },
  },
  [DATASOURCE_VALUES.RAW_JSON]: {
    [DATASOURCE_PROPS_TYPES.RAW_JSON]: {
      name: 'rawJson',
      title: 'Data Source Raw JSON',
      type: 'json',
      placeholder: 'Enter a JSON',
      required: false,
      options: undefined,
      value: '[{"name": "John", "email": "john.doe@test.com"}, {"name": "Jane", "email": "jane.doe@test.com"}]',
      className: 'code-editor-medium',
    },

    [DATASOURCE_PROPS_TYPES.JSON_VALUE]: {
      name: 'jsonValue',
      title: 'Enter Values',
      placeholder: 'Enter values',
      type: 'hidden',
      required: true,
      options: undefined,
      value: [],
    },

    [DATASOURCE_PROPS_TYPES.ID_PATH]: {
      name: 'idPath',
      title: 'Id Path',
      type: 'string',
      placeholder: 'id',
      required: true,
      options: undefined,
      value: 'id',
    },
    [DATASOURCE_PROPS_TYPES.VALUE_PROPERTY]: {
      name: 'valueProperty',
      title: 'Value Property',
      type: 'string',
      placeholder: '',
      required: true,
      options: undefined,
      description: "The selected item's property to save.",
      value: 'email',
    },
    [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]: { ...DEFAULT_DEFAULT_VALUE_PROPS, type: 'select', options: [] },
  },
};

export const dateDataPropertiesStore = {
  [DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]: {
    name: 'defaultValue',
    title: 'Default Value',
    type: 'relative-date',
    placeholder: 'Select a default value',
    required: false,
    options: undefined,
    value: '',
    addDivider: true,
  },
  [DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END]: {
    name: 'defaultValueEnd',
    title: 'Default Value for End Date',
    type: 'relative-date',
    placeholder: 'Select a default value',
    required: false,
    options: undefined,
    value: '',
    hide: true,
  },
  [DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]: {
    name: 'isDateRange',
    title: 'Enable Date Range',
    type: 'boolean',
    placeholder: 'to',
    required: false,
    options: undefined,
    value: false,
  },
  [DATE_DATA_PROPS_TYPES.PLACEHOLDER_END]: {
    name: 'placeholderEnd',
    title: 'Placeholder End Date',
    type: 'string',
    placeholder: 'Enter a placeholder',
    required: false,
    options: undefined,
    value: '',
    hide: true,
  },
  [DATE_DATA_PROPS_TYPES.ENABLE_DATE_INPUT]: {
    name: 'enableDateInput',
    title: 'Enable Date Input',
    type: 'boolean',
    placeholder: 'Enable Date Input',
    required: false,
    options: undefined,
    value: true,
  },
  [DATE_DATA_PROPS_TYPES.ENABLE_TIME_INPUT]: {
    name: 'enableTimeInput',
    title: 'Enable Time Input',
    type: 'boolean',
    placeholder: 'Enable Time Input',
    required: false,
    options: undefined,
    value: true,
  },
  [DATE_DATA_PROPS_TYPES.DISABLE_WEEKENDS]: {
    name: 'disableWeekends',
    title: 'Disable Weekends',
    type: 'boolean',
    placeholder: 'Disable Weekends',
    required: false,
    options: undefined,
    value: false,
  },
  [DATE_DATA_PROPS_TYPES.DISABLE_WEEKDAYS]: {
    name: 'disableWeekdays',
    title: 'Disable Weekdays',
    type: 'boolean',
    placeholder: 'Disable Weekdays',
    required: false,
    options: undefined,
    value: false,
  },
};
