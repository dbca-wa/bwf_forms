import { LAYOUT_CONTROL_PROPS_TYPES } from '../../utils/control-props-types';

export const layoutPropertiesStore = {
  [LAYOUT_CONTROL_PROPS_TYPES.TITLE]: {
    name: 'title',
    title: 'Title',
    type: 'string',
    placeholder: 'Enter a title',
    required: true,
    options: undefined,
    value: '',
  },
  [LAYOUT_CONTROL_PROPS_TYPES.COLUMNS]: {
    name: 'columns',
    title: 'Column properties',
    placeholder: 'Enter COLUMNS',
    type: 'array',
    props: {
      sortable: true,
      structure: {
        size: {
          name: 'size',
          title: 'Size',
          type: 'select',
          placeholder: 'Enter a size',
          required: true,
          options: [
            { text: 'xs', value: 'xs' },
            { text: 'sm', value: 'sm' },
            { text: 'md', value: 'md' },
            { text: 'lg', value: 'lg' },
            { text: 'xl', value: 'xl' },
          ],
          value: 'md',
        },
        width: {
          name: 'width',
          title: 'Text',
          type: 'number',
          placeholder: 'Enter a width',
          required: true,
          options: undefined,
          value: 6,
        },
      },
    },
    required: true,
    options: undefined,
    value: '',
  },
  [LAYOUT_CONTROL_PROPS_TYPES.AUTO_ADJUST_COLUMNS]: {
    name: 'autoAdjustColumns',
    title: 'Auto Adjust Columns',
    type: 'boolean',
    placeholder: 'Enter a auto adjust columns',
    required: true,
    options: undefined,
    value: false,
  },
  [LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION]: {
    name: 'displayDirection',
    title: 'Display Direction',
    type: 'hidden',
    placeholder: 'Enter a display direction',
    required: true,
    value: 'column',
  },
};
