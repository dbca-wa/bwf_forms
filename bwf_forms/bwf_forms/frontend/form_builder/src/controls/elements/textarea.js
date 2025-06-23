import InputControl from '../fb-input-control';
import { markup } from '../../js/utils';
import { InputFieldDisplayProps } from '../config-properties/display-props/input-display-properties';
import {
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
} from '../utils/control-props-types';
import { InputFieldDataProperties } from '../config-properties/data-props/data-properties';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
  [CONTROL_PROPS_TYPES.TEXTAREA_ROWS]: 5,
};

export default class TextAreaElement extends InputControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, attr.type);
    this.setup();
  }

  setup() {
    this.type = this.props.type || defaultSettings.type;
    this.displayControlProps = new InputFieldDisplayProps(this.type, this.props);
    this.dataControlProps = new InputFieldDataProperties(this.type, this.props);
    this.attr['class'] = 'form-control';
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const value = props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
    const attributes = {
      id: props.id ?? this.id,
      type: this.type,
      placeholder: props[CONTROL_PROPS_TYPES.PLACEHOLDER] ?? '',
      class: (this.attr.class ?? '').concat(' ', props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''),
      value: value,
      rows: props[CONTROL_PROPS_TYPES.TEXTAREA_ROWS],
    };

    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }
    if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) attributes.required = true;
    if (props[CONTROL_VALIDATION_PROPS_TYPES.REGEX]) attributes.pattern = props[CONTROL_VALIDATION_PROPS_TYPES.REGEX];

    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.label.required = props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] === true;
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    return super.render(markup('textarea', value, attributes));
  }
}
