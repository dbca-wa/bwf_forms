import { ELEMENT_TYPES } from './utils/element-types';
import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { markup } from '../js/utils';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
} from './utils/control-props-types';
import { BasicAPIProps } from './config-properties/api-props/basic-api-properties';
import { InputFieldValidationProps } from './config-properties/validation-props/input-validation-properties';
import { CLASS_INVALID_FIELD_VALUE } from './utils/constants';
import { runInputFieldValidations } from '../js/validation-utils';
import { INPUT_TYPES } from './utils/input-types';
import { BuildArea } from '../js/fb-build-area';
import { MultivalueRenderer } from './renderers/multivalue-renderer';
import { MultipleChoiceDataProperties } from './config-properties/data-props/multiple-choice-data-props';
import { NumberArrowsRenderer } from './renderers/number-arrows-renderer';

function extractLabelProps(props = {}) {
  const labelProps = {};
  for (let key in props) {
    if (key.startsWith('label') && key !== 'label') {
      let _key = key.replace('label', '').toLowerCase();
      labelProps[_key] = props[key];
    }
  }
  return labelProps;
}

export default class InputControl extends Control {
  container_class = 'py-2';
  elementType;
  description;
  tooltip;
  constructor(attr, props, elementType) {
    super(attr, props, CONTROL_TYPES.ELEMENT);
    this.elementType = elementType || ELEMENT_TYPES.INPUT;
    this.label = new Label(props['label'] || '', extractLabelProps(props)); // Default label

    this._basicSetup();
  }

  _basicSetup() {
    this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] =
      this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] ||
      BuildArea.getInstance().generateAPIFieldName(this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT] ?? this.type);

    this.container_class = this.props?.container_class || this.container_class;
    this.dataControlProps = {};
    this.validationControlProps = new InputFieldValidationProps(this.elementType, this.props);
    this.apiControlProps = new BasicAPIProps(this.elementType, this.props);
  }

  setup() {
    console.log('Setup method called');
  }

  isShowLabel() {
    return this.label.text !== '' && !this.displayControlProps.props[CONTROL_PROPS_TYPES.HIDE_LABEL]?.value;
  }

  toJSON() {
    const json = {
      id: this.id,
      controlType: this.controlType,
      elementType: this.elementType,
      parentAreaId: this.parentAreaId,
      attr: this.attr,
      props: this.getPropsObject(),
    };
    return json;
  }

  setInitialValue(value) {
    try {
      if (this.dataControlProps && this.dataControlProps instanceof MultipleChoiceDataProperties) {
        this.dataControlProps.datasourceProperties.modifyPropValue(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, value);
      } else {
        this.dataControlProps.modifyPropValue(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, value);
      }
    } catch (error) {
      console.error('Error setting initial value', { error, value });
    }
  }

  getAttributes() {
    const attributes = {};
    for (let key in this.attr) {
      attributes[key] = this.attr[key];
    }
    return attributes;
  }

  getElementValue() {
    const element = $(this.getIdSelector());
    if (!element) {
      console.error('Element not found', { elem: this });
      return '';
    }
    if (this.elementType === INPUT_TYPES.RADIO) {
      return element.find('input[type="radio"]:checked').val() ?? '';
    }
    if (this.type === INPUT_TYPES.CHECK_BOX) {
      return element.is(':checked');
    }
    if (this.type === INPUT_TYPES.NUMBER) {
      return element.val() ? parseFloat(element.val()) : null;
    }
    if (this.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
      const props = this.getPropsObject();
      if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
        return [element.datepicker('getDate'), $(this.getIdSelector() + '-end').datepicker('getDate')];
      }
      return element.datepicker('getDate');
    }
    const props = this.getPropsObject();
    if (props[CONTROL_PROPS_TYPES.DISPLAY_MASK]) return element.cleanVal();

    return element.val().trim();
  }

  getFieldValue() {
    if (!this.apiControlProps) return {};
    const props = this.apiControlProps.getPropsValues();
    return {
      [props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]: this.getElementValue(),
    };
  }

  modifyProps(props) {
    // This method should be overridden by the child class
    // It's meant to modify some props before rendering the control
  }

  validateValue() {
    const validationProps = this.validationControlProps?.getPropsValues();

    const value = this.getElementValue();
    const errors = runInputFieldValidations(value, this);
    let errorMessage = '';
    if (errors.length > 0) {
      errorMessage = validationProps[CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE] || errors.join(', ');
    }
    $(`#render-${this.id}`).find(`.${CLASS_INVALID_FIELD_VALUE}`).first()?.text(errorMessage);
    return errors.length === 0;
  }

  renderControl(isDisplayMode = false) {
    const props = this.displayControlProps?.getPropsValues();
    Object.assign(
      props,
      this.dataControlProps?.getPropsValues(),
      this.validationControlProps?.getPropsValues(),
      this.apiControlProps?.getPropsValues(),
    );
    if (!isDisplayMode) {
      delete props[CONTROL_PROPS_TYPES.HIDDEN];
      delete props[CONTROL_PROPS_TYPES.HIDE_LABEL];
    }
    return this.render({
      id: this.id,
      name: this.props.name,
      ...props,
    });
  }

  render(element = markup('span', 'no element to display')) {
    const inputGroup = [];
    const props = this.getPropsObject();
    const labelPosition = props[CONTROL_PROPS_TYPES.LABEL_POSITION] ?? 'top';

    if (props[CONTROL_DATA_PROPS_TYPES.MULTI]) {
      this.renderer = new MultivalueRenderer(this, element, {});
      inputGroup.push(this.renderer.render());
    } else if (props[CONTROL_PROPS_TYPES.SIDE_BUTTONS]) {
      this.renderer = new NumberArrowsRenderer(this, element, props);
      inputGroup.push(this.renderer.render());
    } else {
      inputGroup.push(element);
    }
    const containerId = `render-${this.id}`;
    const tooltip = this.tooltip
      ? markup('i', '', {
          class: 'bi bi-question-circle-fill label-tooltip',
          'data-bs-toggle': 'tooltip',
          'data-bs-title': this.tooltip,
        })
      : undefined;
    const labelElement = this.label.render();
    const description = this.description ? markup('small', this.description, { class: 'form-text' }) : undefined;
    const invalidField = markup('div', '', { class: CLASS_INVALID_FIELD_VALUE });
    const labelGroup = [];

    if (this.isShowLabel()) {
      labelGroup.push(labelElement);
    }
    if (tooltip) labelGroup.push(tooltip);

    const isCheckbox = this.type === ELEMENT_TYPES.CHECK_BOX;
    if (description) {
      if (!isCheckbox) {
        inputGroup.push(description);
        inputGroup.push(markup('br'));
      }
    }
    if (isCheckbox) {
      const isLeftAlign = labelPosition === 'left';

      if (isLeftAlign) {
        inputGroup.push(invalidField);
        const checkBoxDiv = labelGroup.concat(inputGroup);
        return markup('div', [markup('div', checkBoxDiv, { class: 'd-flex form-flex-checkbox-left' }), description], {
          id: containerId,
        });
      } else {
        labelGroup.push(invalidField);
        const checkBoxDiv = inputGroup.concat(labelGroup);
        return markup('div', [markup('div', checkBoxDiv, { class: 'd-flex form-flex-checkbox-right' }), description], {
          id: containerId,
        });
      }
    }

    inputGroup.push(invalidField);
    if (['left', 'right'].includes(labelPosition)) {
      const divLabel = markup('div', labelGroup, { class: 'col-sm-2 pt-1' });
      const divInput = markup('div', inputGroup, {
        class: ['col-sm-10', isCheckbox ? 'align-items-center' : ''].join(' '),
      });
      const mainDiv = [divLabel, divInput];

      return markup('div', labelPosition === 'left' ? mainDiv : mainDiv.reverse(), {
        class: [this.container_class ?? '', 'row', 'align-items-start'].join(' '),
        id: containerId,
      });
    }

    return markup('div', labelPosition === 'top' ? labelGroup.concat(inputGroup) : inputGroup.concat(labelGroup), {
      class: this.container_class,
      id: containerId,
    });
  }

  afterRender() {
    const props = this.getPropsObject();
    if (props[CONTROL_PROPS_TYPES.DISPLAY_MASK]) {
      $(this.getIdSelector()).mask(props[CONTROL_PROPS_TYPES.DISPLAY_MASK]);
    }

    if (this.renderer) this.renderer.afterRender();
  }
  getDefaultValue() {
    const props = this.getPropsObject();
    return props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
  }
}
