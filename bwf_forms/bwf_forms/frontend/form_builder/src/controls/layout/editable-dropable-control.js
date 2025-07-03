import { DropableControl } from './dropable-control';
import { markup } from '../../js/utils';
import {
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
} from '../utils/control-props-types';
import { LAYOUT_TYPES } from '../utils/layout-types';
import { CLASS_INVALID_FIELD_VALUE } from '../utils/constants';
import { MultiControlRenderer } from '../renderers/multicontrol-renderer';

const defaultSettings = {};

export class EditableDropableControl extends DropableControl {
  initialValues;
  constructor(attr = {}, props = {}) {
    super(attr, props);
    this.elementType = LAYOUT_TYPES.EDIT_DROPABLE;
    this.dropableType = LAYOUT_TYPES.EDIT_DROPABLE;
  }

  addChildControl(control) {
    super.addChildControl(control);
  }

  removeChildControl(controlId) {
    super.removeChildControl(controlId);

    // re set rows
  }

  validateValue() {
    if (!this.validationControlProps) return true;
    const props = this.validationControlProps.getPropsValues();
    const values = this.getFieldValue();
    const errors = [];
    if (
      props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] &&
      props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] > 0 &&
      values.length < props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS]
    ) {
      const isOne = props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] === 1;
      errors.push(`You must add at least ${props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS]} item${isOne ? '' : 's'}`);
    }
    if (
      props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS] &&
      props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS] > 0 &&
      values.length > props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS]
    ) {
      const isOne = props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] === 1;
      errors.push(`You can only add up to ${props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS]} item${isOne ? '' : 's'}`);
    }
    if (errors.length === 0 && this.renderer && !this.renderer.validateRows()) {
      errors.push('There are invalid values or unsaved changes in the rows');
    }

    let errorMessage = '';
    if (errors.length > 0) {
      errorMessage = props[CONTROL_VALIDATION_PROPS_TYPES.ERROR_MESSAGE] || errors.join(', ');
    }
    $(this.getIdSelector() + ` .${CLASS_INVALID_FIELD_VALUE}`)
      .last()
      .text(errorMessage);

    return errors.length === 0;
  }

  getFieldValue() {
    if (this.renderer) {
      return this.renderer.getValues();
    }
    return [];
  }

  toDisplay(parentContainer) {
    const props = this.displayControlProps.getPropsValues();

    const container = markup('div', '', {
      class: [props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '', 'px-4', 'mb-3'].join(' '),
      id: this.id,
      'data-parentAreaId': this.parentAreaId,
      'data-areaId': this.areaId,
    });
    const invalidField = markup('div', '', { class: CLASS_INVALID_FIELD_VALUE });

    if (parentContainer) {
      parentContainer.append(container);
      this.renderer = new MultiControlRenderer(this, this.children, {
        ...this.validationControlProps.getPropsValues(),
        [CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE]: this.initialValues,
      });
      container.append(this.renderer.render());
      this.renderer.afterRender();
    }
    container.append(invalidField);

    return container;
  }

  setInitialValue(value) {
    this.initialValues = value;
  }
}
