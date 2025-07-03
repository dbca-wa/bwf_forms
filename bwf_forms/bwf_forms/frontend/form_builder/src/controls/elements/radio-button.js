import Handlebars from 'handlebars';
import InputControl from '../fb-input-control';
import { generateRandomId, markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';

import {
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATASOURCE_PROPS_TYPES,
} from '../utils/control-props-types';
import { RadioDisplayProps } from '../config-properties/display-props/input-display-properties';
import { RadioButtonsDataProperties } from '../config-properties/data-props/data-properties';

const defaultSettings = {
  class: 'form-check-input',
};

const defaultProps = {};
const defaultOptions = [
  {
    text: 'Option 1',
    value: 'opt1',
  },
  {
    text: 'Option 2',
    value: 'opt2',
  },
];

export default class RadioButton extends InputControl {
  options = defaultOptions;

  constructor(attr = {}, props = {}) {
    let _attr = Object.assign({}, defaultSettings, attr);
    let _props = Object.assign({}, defaultProps, props);
    super(_attr, _props, ELEMENT_TYPES.RADIO);
    this.setup();
  }

  setup() {
    this.name = 'rb-' + generateRandomId();
    this.displayControlProps = new RadioDisplayProps(this.props);
    this.dataControlProps = new RadioButtonsDataProperties(this.props);
    this.container_class = 'form-group';
    this.options = this.props.values || this.options;
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

    const template = Handlebars.compile(itemTemplate);
    const radioButtons = [];
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const customProps = {
        type: 'radio',
        id: `${this.name}-${i}`,
        name: this.name,
        value: opt[valueProperty],
        class: 'form-check-input',
      };
      if (props[CONTROL_PROPS_TYPES.DISABLED]) {
        customProps.disabled = true;
      }
      if (props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE] === opt[valueProperty]) {
        customProps.checked = true;
      }
      if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) customProps.required = true;
      let text = '';
      try {
        text = template({ item: opt });
      } catch (error) {
        text = opt.text;
      }

      radioButtons.push(
        markup(
          'div',
          [
            markup('input', '', customProps),
            markup('label', text, { for: `${this.name}-${i}`, class: 'form-check-label' }),
          ],
          { class: 'form-check' },
        ),
      );
    }
    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.label.required = props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] === true;
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];

    const elements = radioButtons;
    return super.render(markup('div', elements, { class: this.container_class, id: props.id ?? this.id }));
  }
}
