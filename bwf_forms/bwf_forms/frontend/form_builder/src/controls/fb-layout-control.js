import { CONTROL_TYPES } from './utils/control-types';
import Label from './elements/basics/label';
import Control from '../js/fb-control';
import { generateRandomId, markup } from '../js/utils';
import { CONTROL_API_PROPS_TYPES } from './utils/control-props-types';

export default class LayoutControl extends Control {
  container_class = 'formarea-control';
  children = [];
  areaId;
  onDrop = () => {};
  onRemove = () => {};

  constructor(attr, props, elementType) {
    super(attr, props, CONTROL_TYPES.LAYOUT);

    if (elementType) this.elementType = elementType;

    this._basicSetup();
  }

  _basicSetup() {
    this.container_class = this.props?.container_class || this.container_class;
    this.label = new Label(this.props['label'] || ''); // Default label
    this.areaId = this.props.areaId ?? ['area-', generateRandomId()].join('');
    this.parentAreaId = this.props.parentAreaId;
    delete this.props.areaId;
    delete this.props.parentAreaId;
  }

  setup() {
    console.log('Setup method called');
  }

  setChildrenFromProps() {
    if (this.props.children) {
      this.children = this.props.children;
      this.children.forEach((c) => {
        c.parentAreaId = this.areaId;
      });
      delete this.props.children;
    }
  }

  clearContainer() {
    this.children = [];
  }

  toJSON() {
    const json = {
      id: this.id,
      controlType: this.controlType,
      elementType: this.elementType,
      // attr: this.attr,
      props: {
        ...this.getPropsObject(),
        areaId: this.areaId,
        parentAreaId: this.parentAreaId,
      },
    };
    if (this.children.length) {
      json.children = this.children.map((c) => c.toJSON());
    }

    return json;
  }

  setInitialValue(value) {
    try {
      const parentProps = this.apiControlProps?.getPropsValues() ?? {};
      const fieldName = parentProps[CONTROL_API_PROPS_TYPES.FIELD_NAME];
      const fieldValue = fieldName ? value[fieldName] : undefined;
      if (fieldValue) {
        this.children.forEach((elm) => elm.setInitialValue(fieldValue));
      } else {
        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i];
          const childProps = child.apiControlProps?.getPropsValues() ?? {};
          const childFieldName = childProps[CONTROL_API_PROPS_TYPES.FIELD_NAME];
          const childValue = childFieldName ? value[childFieldName] : undefined;
          if (childValue) {
            child.setInitialValue(childValue);
          }
        }
      }
    } catch (error) {
      console.error('Error setting initial value', { error, value });
    }
  }

  validateValue() {
    let isValid = true;

    for (let i = 0; i < this.children.length; i++) {
      const elmIsValid = this.children[i].validateValue();
      isValid &= elmIsValid;
    }
    return isValid;
  }

  isEmpty() {
    let empty = true;
    for (let i = 0; i < this.children.length; i++) {
      if (typeof this.children[i].isEmpty !== 'function') {
        empty = false;
        break;
      }
      const elmIsEmpty = this.children[i].isEmpty();
      empty &= elmIsEmpty;
    }
    return empty;
  }

  getFieldValue() {
    const values = {};
    const props = this.apiControlProps?.getPropsValues() ?? {};
    this.children.forEach((elm) => Object.assign(values, elm.getFieldValue()));
    const fieldName = props[CONTROL_API_PROPS_TYPES.FIELD_NAME] ?? '';
    return fieldName ? { [fieldName]: values } : values;
  }

  getElementValue() {
    return this.getFieldValue();
  }

  getDefaultValue() {
    const values = {};
    this.children.forEach((elm) => {
      const props = elm.getPropsObject();
      const defaultValue = elm.getDefaultValue();
      const fieldName = props['fieldName']; // Hardcoded fieldName

      Object.assign(values, fieldName ? { [fieldName]: defaultValue } : defaultValue);
    });
    return values;
  }

  toDisplay(container) {
    const parent = markup('div', '', { class: this.container_class, id: this.id });
    container.append(parent);
    for (let i = 0; i < this.children.length; i++) {
      const column = this.children[i];
      column.toDisplay(parent);
    }
  }

  renderControl(displayMode) {
    return this.render(this.children.map((c) => c.renderControl(displayMode)));
  }

  render(children = []) {
    if (!Array.isArray(children)) {
      children = [children];
    }
    return markup('div', children, { class: this.container_class, id: `render-${this.id}` });
  }
}
