import Handlebars from 'handlebars';
import InputControl from '../fb-input-control';
import { generateRandomId, markup } from '../../js/utils';
import { InputFieldDisplayProps } from '../config-properties/display-props/input-display-properties';
import {
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATASOURCE_PROPS_TYPES,
} from '../utils/control-props-types';
import { SelectBoxesDataProperties } from '../config-properties/data-props/data-properties';
import { ELEMENT_TYPES } from '../utils/element-types';

const defaultSettings = {
  type: 'text',
  value: [],
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
};

export default class SelectBoxes extends InputControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.SELECT_BOXES);
    this.setup();
  }

  setup() {
    this.type = this.props.type || defaultSettings.type;
    this.displayControlProps = new InputFieldDisplayProps(this.type, this.props);
    this.dataControlProps = new SelectBoxesDataProperties(this.props);
    this.name = 'sb-' + generateRandomId();
    this.container_class = 'form-group';
    this.options = this.props.values || this.options;
  }

  getElementValue() {
    const values = [];
    document.querySelectorAll(`${this.getIdSelector()} input[type="checkbox"][name="${this.name}"]`).forEach((el) => {
      if (el.checked) {
        values.push(el.value);
      }
    });
    return values;
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

    const attributes = {
      id: props.id ?? this.id,
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
    };
    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }

    const template = Handlebars.compile(itemTemplate);
    const selectBoxes = [];
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const customProps = {
        type: 'checkbox',
        id: `${this.name}-${i}`,
        name: this.name,
        value: opt[valueProperty],
        class: 'form-check-input',
      };
      if (props[CONTROL_PROPS_TYPES.DISABLED]) customProps.disabled = true;

      try {
        if (props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE].includes(opt[valueProperty])) {
          customProps.checked = true;
        }
      } catch (error) {}

      let text = '';
      try {
        text = template({ item: opt });
      } catch (error) {
        text = opt.text;
      }
      selectBoxes.push(
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

    const elements = selectBoxes;
    return super.render(markup('div', elements, { class: this.container_class, id: props.id ?? this.id }));
  }
}
