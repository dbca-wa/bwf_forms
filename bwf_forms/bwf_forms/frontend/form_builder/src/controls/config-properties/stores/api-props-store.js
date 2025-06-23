import { CONTROL_API_PROPS_TYPES } from '../../utils/control-props-types';

export const apiPropertiesStore = {
  [CONTROL_API_PROPS_TYPES.FIELD_NAME]: {
    name: 'fieldName',
    title: 'Field Name',
    type: 'string',
    required: true,
    options: undefined,
    value: '',
    pattern: /^[a-zA-Z]+[a-zA-Z0-9\_\-]*$/,
  },
};
