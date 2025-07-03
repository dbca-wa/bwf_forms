import { generateRandomId, markup } from '../../js/utils';
import { ELEMENT_TYPES } from '../utils/element-types';
import { ButtonDisplayProps } from '../config-properties/display-props/input-display-properties';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import LayoutControl from '../fb-layout-control';

const defaultSettings = {
  class: 'form-check-input',
};

const defaultProps = {
  [CONTROL_PROPS_TYPES.LABEL]: 'Button',
  [CONTROL_PROPS_TYPES.THEME]: 'primary',
};

export default class ButtonElement extends LayoutControl {
  elementType = ELEMENT_TYPES.BUTTON;
  constructor(attr = { value: 'default' }, props = {}) {
    let _attr = Object.assign({}, defaultSettings, attr);
    let _props = Object.assign({}, defaultProps, props);
    super(_attr, _props, ELEMENT_TYPES.BUTTON, 'bt-' + generateRandomId());
    this.setup();
  }

  setup() {
    this.displayControlProps = new ButtonDisplayProps(this.props);
    this.dataControlProps = undefined;
  }

  toDisplay(container) {
    container.appendChild(this.render());
  }

  renderControl(isDisplayMode = false) {
    const props = this.displayControlProps?.getPropsValues();
    Object.assign(props, this.dataControlProps?.getPropsValues());

    return this.render({
      id: this.id,
      name: this.props.name,
      ...props,
    });
  }

  render(customProps, attr) {
    const props = customProps ?? this.displayControlProps.getPropsValues();
    const label = props[CONTROL_PROPS_TYPES.LABEL];
    const containerClass = [props[CONTROL_PROPS_TYPES.BLOCK_BUTTON] ? 'd-grid' : '', 'my-1'].join(' ');
    const tooltip = props[CONTROL_PROPS_TYPES.TOOLTIP];

    const className = [
      'btn',
      `btn-${props[CONTROL_PROPS_TYPES.THEME]}`,
      props[CONTROL_PROPS_TYPES.SIZE] ? `btn-${props[CONTROL_PROPS_TYPES.SIZE]}` : '',
      props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '',
    ];

    const attributes = {
      id: props.id ?? this.id,
      class: className.join(' '),
      type: props[CONTROL_PROPS_TYPES.ACTION],
    };

    const children = [];
    const elements = [];
    if (props[CONTROL_PROPS_TYPES.LEFT_ICON]) {
      children.push(markup('i', '', { class: props[CONTROL_PROPS_TYPES.LEFT_ICON] }));
    }
    children.push(`&nbsp;${label}&nbsp;`);
    if (props[CONTROL_PROPS_TYPES.RIGHT_ICON]) {
      children.push(markup('i', '', { class: props[CONTROL_PROPS_TYPES.RIGHT_ICON] }));
    }

    if (tooltip) {
      attributes.class += ' label-tooltip';
      attributes['data-bs-toggle'] = 'tooltip';
      attributes['data-bs-title'] = tooltip;
    }

    elements.push(markup('button', children, attributes));
    return markup('div', elements, {
      id: `render-${this.id}`,
      class: containerClass ?? this.props.containerClass,
    });
  }
}
