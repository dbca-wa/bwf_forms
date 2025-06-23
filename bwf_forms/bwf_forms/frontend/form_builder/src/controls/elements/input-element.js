import InputControl from '../fb-input-control';
import { markup } from '../../js/utils';
import { INPUT_TYPES } from '../utils/input-types';

import { InputFieldDisplayProps } from '../config-properties/display-props/input-display-properties';
import {
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
} from '../utils/control-props-types';
import { InputFieldDataProperties } from '../config-properties/data-props/data-properties';
import { ELEMENT_TYPES } from '../utils/element-types';
import { InputFieldValidationProps } from '../config-properties/validation-props/input-validation-properties';
import { GENERAL_DATE_FORMAT } from '../utils/constants';
import { format } from 'date-fns';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
  [CONTROL_DATA_PROPS_TYPES.MULTI]: false,
};

export default class InputElement extends InputControl {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.INPUT);
    this.setup();
  }

  setup() {
    this.type = this.props.type || defaultSettings.type;
    this.displayControlProps = new InputFieldDisplayProps(this.type, this.props);
    this.dataControlProps = new InputFieldDataProperties(this.type, this.props);
    this.validationControlProps = new InputFieldValidationProps(this.type, this.props);

    if (this.type === INPUT_TYPES.RADIO) {
      this.attr['class'] = 'form-check-input';
      this.id = this.props.id;
    } else if (INPUT_TYPES.CHECK_BOX == this.attr.type) {
      this.attr['class'] = 'form-check-input';
      this.label.attr.for = this.id;
      this.label.attr.class = 'form-check-label';
      this.container_class = 'form-check';
    } else {
      this.attr['class'] = 'form-control';
    }
  }

  render(customProps, attr = {}) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    this.modifyProps(props);
    const values = props.values;
    let value = props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
    if (values && values.length > 0) {
      value = values[0];
    }
    const formControlSizeClass = props[CONTROL_PROPS_TYPES.SIZE]
      ? `form-control-${props[CONTROL_PROPS_TYPES.SIZE]}`
      : '';
    const attributes = {
      id: props.id ?? this.id,
      type: this.type,
      placeholder: props[CONTROL_PROPS_TYPES.PLACEHOLDER] ?? '',
      class: [this.attr.class ?? '', formControlSizeClass, props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? ''].join(' '),

      value: value,
    };

    if (props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) attributes.required = true;
    if (props[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH])
      attributes.minlength = props[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH];
    if (props[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH])
      attributes.maxlength = props[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH];
    if (props[CONTROL_VALIDATION_PROPS_TYPES.MIN_VALUE])
      attributes.min = props[CONTROL_VALIDATION_PROPS_TYPES.MIN_VALUE];
    if (props[CONTROL_VALIDATION_PROPS_TYPES.MAX_VALUE])
      attributes.max = props[CONTROL_VALIDATION_PROPS_TYPES.MAX_VALUE];

    if (this.type === 'radio') {
      attributes.name = this.props.name;
      delete attributes.placeholder;
      delete attributes.value;
    }
    if (this.type === 'checkbox') {
      attributes.name = this.props.name;
      attributes.checked = value === true;

      delete attributes.placeholder;
      delete attributes.value;
    }
    if (props[CONTROL_PROPS_TYPES.DISABLED]) {
      attributes.disabled = true;
    }
    if (props[CONTROL_VALIDATION_PROPS_TYPES.REGEX]) attributes.pattern = props[CONTROL_VALIDATION_PROPS_TYPES.REGEX];

    this.label.text = props[CONTROL_PROPS_TYPES.LABEL];
    this.label.display = !!!props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    this.label.required = props[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED] === true;
    this.description = props[CONTROL_PROPS_TYPES.DESCRIPTION];
    this.tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    if (this.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
      if (value) {
        attributes.value = format(value, GENERAL_DATE_FORMAT);
      }
      if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
        const endDateAttributes = {
          ...attributes,
          id: `${attributes.id}-end`,
          placeholder: props[DATE_DATA_PROPS_TYPES.PLACEHOLDER_END] ?? '',
          value: props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END],
        };
        if (values && values.length > 1) {
          try {
            endDateAttributes.value = format(values[1], GENERAL_DATE_FORMAT);
          } catch (error) {
            endDateAttributes.value = values[1];
          }
        }
        return super.render(
          markup(
            'div',
            [
              markup('div', markup('input', '', { ...attributes, ...attr }), { class: 'col-auto' }),
              markup('div', markup('input', '', { ...endDateAttributes, ...attr }), {
                class: 'col-auto',
              }),
            ],
            { class: 'row g-3 align-items-center' },
          ),
        );
      }
    }

    return super.render(markup('input', '', { ...attributes, ...attr }));
  }
}
