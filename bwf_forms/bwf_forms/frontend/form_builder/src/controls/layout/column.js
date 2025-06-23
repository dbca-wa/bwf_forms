import { markup } from '../../js/utils';
import LayoutControl from '../fb-layout-control';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';
import { LAYOUT_TYPES } from '../utils/layout-types';

const defaultSettings = {};

export class Column extends LayoutControl {
  elementType = LAYOUT_TYPES.COLUMN;
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, CONTROL_TYPES.LAYOUT);
    this.setup();
  }

  toDisplay(container) {
    const props = this.props;
    const column = this.render(props);
    container.append(column);
    for (let i = 0; i < this.children.length; i++) {
      const control = this.children[i];
      control.toDisplay(column);
    }
  }

  renderControl(isDisplayMode = false) {
    return this.render({
      ...this.props,
    });
  }

  render(customProps) {
    const props = customProps ?? this.props;

    return super.render(markup('div', '', { id: props.id, class: props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] }));
  }
}
