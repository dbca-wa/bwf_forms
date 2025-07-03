import { CONTROL_VALIDATION_PROPS_TYPES } from '../controls/utils/control-props-types';
import { activateTooltips } from './control-utils';
import { generateRandomId, markup } from './utils';

export default class Control {
  id = '';
  parentAreaId;
  attr = {};

  props = {};

  className = '';

  controlType = 'BLOCK';
  elementType; // More specific, directly related to the class
  displayControlProps;
  dataControlProps;
  validationControlProps;
  apiControlProps;

  $p; // Parent element for rendering purposes
  renderer;

  constructor(attr, props, controlType, id = null) {
    this.controlType = controlType;
    this.attr = attr;
    this.props = props;
    this.events = {};
    this.id = id || this.props.id || `${this.controlType.toLowerCase()}-${generateRandomId()}`;
    delete this.props.id;
  }

  setup() {
    console.log('Setup method called');
  }

  getIdSelector() {
    return `#${this.id}`;
  }

  setParent(parent) {
    this.$p = parent;
  }

  renderInParent(parent = null) {
    if (parent) this.setParent(parent);
    if (this.$p) this.$p.empty().append(this.renderControl());
    if (this.$p) {
      activateTooltips(this.$p);
      this.afterRender();
    }
  }

  getPropsObject() {
    return {
      ...this.props,
      ...this.displayControlProps?.getPropsValues(),
      ...this.dataControlProps?.getPropsValues(),
      ...this.validationControlProps?.getPropsValues(),
      ...this.apiControlProps?.getPropsValues(),
    };
  }

  toJSON() {
    const json = {
      id: this.id,
      controlType: this.controlType,
      elementType: this.elementType,
      // attr: this.attr,
      props: this.getPropsObject(),
    };
    return json;
  }

  toDisplay(container) {
    this.$p = container;
    container.append(this.renderControl(true));
    this.addControlEvents();
    this.afterRender();
  }

  addControlEvents() {
    const validationProps = this.validationControlProps?.getPropsValues();
    if (!validationProps) return;
    const eventType = validationProps[CONTROL_VALIDATION_PROPS_TYPES.VALIDATE_ON];
    if (!eventType) return;
    $(this.getIdSelector()).on(eventType, this, (e) => {
      const _this = e.data;
      _this.validateValue();
    });
  }

  validateValue() {
    return true;
  }

  renderControl() {
    return this.render();
  }

  afterRender() {}

  render(children = [], containerClass = '') {
    if (!Array.isArray(children)) {
      children = [children];
    }
    // Implement rendering logic here
    const container = markup('div', children, {
      id: `render-${this.id}`,
      class: containerClass ?? this.props.containerClass,
    });
    return container;
  }

  on(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  off(event, handler) {
    if (!this.events[event]) return;

    const index = this.events[event].indexOf(handler);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  trigger(event, ...args) {
    if (!this.events[event]) return;

    this.events[event].forEach((handler) => handler(...args));
  }
}
