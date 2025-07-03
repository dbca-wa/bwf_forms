import { markup } from '../../js/utils';

import { ControlPropFactory } from './control-prop-factory';

export class BaseControlProps {
  props = {};
  initialProps = {};

  constructor(propsList = [], customPropsStore) {
    for (let i = 0; i < propsList.length; i++) {
      const prop = propsList[i];
      let cp = ControlPropFactory.createControlProp(prop, customPropsStore);
      this.props[prop] = cp;
    }
  }

  fillInProps(hostProps) {
    if (!hostProps) return;
    this.initialProps = hostProps;
    for (const key in this.props) {
      if (hostProps[key] !== undefined && this.props.hasOwnProperty(key)) {
        this.props[key].prop.value = hostProps[key];
      }
    }
  }

  getPropsValues() {
    const props = {};
    for (const key in this.props) {
      if (this.props.hasOwnProperty(key)) {
        props[key] = this.props[key].prop.value;
      }
    }
    return props;
  }

  modifyPropValue(propName, value) {
    if (this.props[propName]) {
      this.props[propName].prop.value = value;
    }
  }

  modifyProp(propName, values = {}) {
    if (this.props[propName]) {
      this.props[propName].prop = { ...this.props[propName].prop, ...values };
    }
  }

  showProp(propName) {
    this.modifyPropVisibility(propName, false);
  }

  hideProp(propName) {
    this.modifyPropVisibility(propName, true);
  }

  modifyPropVisibility(propName, hide = true) {
    if (this.props[propName]) {
      this.props[propName].prop.hide = hide;
    }
  }

  addChangeEvents(context, cb) {
    Object.values(this.props).map((prop) => prop.addChangeEvent(context, cb));
  }

  render() {
    return markup(
      'div',
      Object.values(this.props).map((prop) => prop.renderProp()),
      { class: '' },
    );
  }
}
