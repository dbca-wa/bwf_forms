import LayoutControl from '../fb-layout-control';
import { markup } from '../../js/utils';
import { CONTROL_PROPS_TYPES, LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { HTMLComponentDisplayProps } from '../config-properties/display-props/layout-display-properties';
import { CONTROL_TYPES } from '../utils/control-types';
import Label from '../elements/basics/label';
import { LAYOUT_TYPES } from '../utils/layout-types';

const defaultSettings = {
  tag: 'div',
  [CONTROL_PROPS_TYPES.HIDE_LABEL]: true,
};

export class HTMLComponent extends LayoutControl {
  elementType = LAYOUT_TYPES.HTML_CONTENT;
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);

    super(attr, _props, CONTROL_TYPES.LAYOUT);
    this.label = new Label(props['label']); // Default label

    this.setup();
  }

  toDisplay(container) {
    const htmlContent = this.renderControl();
    container.append(htmlContent);
  }
  setup() {
    this.container_class = this.props?.container_class || 'html-block';
    this.displayControlProps = new HTMLComponentDisplayProps(this.props);
    this.dataControlProps = null;
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

  render(customProps) {
    const props = customProps ?? this.props;

    const content =
      props[LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT] ?? this.props[LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT];
    const tag = props[LAYOUT_CONTROL_PROPS_TYPES.TAG] ?? this.props[LAYOUT_CONTROL_PROPS_TYPES.TAG];

    const elements = [];
    try {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(content, 'text/html');
      const element = markup(tag || 'div', '', { class: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] });
      element.append(...htmlDoc.body.childNodes);

      elements.push(element);
    } catch (error) {
      // console.log(error);
    }

    return markup('div', elements, { id: props.id ?? this.id });
  }

  getDefaultValue() {
    return this.render();
  }
  getElementValue() {
    return this.render();
  }
}
