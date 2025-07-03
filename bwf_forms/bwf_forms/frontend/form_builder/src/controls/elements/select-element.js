import Handlebars from 'handlebars';
import InputControl from '../fb-input-control';
import { markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';

import {
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATASOURCE_PROPS_TYPES,
} from '../utils/control-props-types';
import { SelectDataProperties } from '../config-properties/data-props/data-properties';
import { SelectDisplayProps } from '../config-properties/display-props/input-display-properties';

const defaultSettings = {
  value: '',
  label: 'Select Component',
  placeholder: '-- Select an option --',
};

const basicOptions = [
  {
    value: '',
    text: '-- Selecta an option --',
    disabled: true,
    selected: true,
  },
  {
    value: '1',
    text: 'Option 1',
  },
  {
    value: '2',
    text: 'Option 2',
  },
];

export default class SelectElement extends InputControl {
  options = basicOptions;

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.SELECT);

    this.setup();
  }

  setup() {
    this.displayControlProps = new SelectDisplayProps(this.props);
    this.dataControlProps = new SelectDataProperties(this.props);

    this.options = this.props.options || this.options;
    this.attr['class'] = 'form-select';
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();

    const options =
      props[CONTROL_DATA_PROPS_TYPES.DATASOURCE] === DATASOURCE_PROPS_TYPES.VALUES
        ? props[DATASOURCE_PROPS_TYPES.VALUES]
        : props[DATASOURCE_PROPS_TYPES.JSON_VALUE] || this.options;
    const valueProperty =
      props[CONTROL_DATA_PROPS_TYPES.DATASOURCE] === DATASOURCE_PROPS_TYPES.RAW_JSON
        ? props[DATASOURCE_PROPS_TYPES.VALUE_PROPERTY]
        : 'value';
    const itemTemplate = props[CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE] ?? '';

    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.label.required = props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] === true;
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    const attributes = {
      id: props.id ?? this.id,
      value: this.value,
      placeholder: props[CONTROL_PROPS_TYPES.PLACEHOLDER] ?? '',
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
    };
    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }
    if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) attributes.required = true;

    const selectEl = markup('select', '', attributes);
    if (props[CONTROL_PROPS_TYPES.PLACEHOLDER]) {
      selectEl.append(
        markup('option', props[CONTROL_PROPS_TYPES.PLACEHOLDER], {
          value: '',
          selected: true,
        }),
      );
    }

    if (Array.isArray(options)) {
      const template = Handlebars.compile(itemTemplate);
      options.forEach((option) => {
        const attributes = {
          value: option[valueProperty],
        };
        if (option[valueProperty] === props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]) {
          attributes.selected = true;
        }
        try {
          selectEl.appendChild(markup('option', template({ item: option }), attributes));
        } catch (error) {
          selectEl.appendChild(markup('option', '-invalid template-', attributes));
        }
      });
    }
    return super.render(selectEl);
  }
}
