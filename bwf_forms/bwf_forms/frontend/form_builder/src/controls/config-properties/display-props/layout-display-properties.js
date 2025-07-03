import { generateRandomId } from '../../../js/utils';
import { LAYOUT_CONTROL_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../../utils/control-props-types';
import { LAYOUT_TYPES } from '../../utils/layout-types';
import { BaseControlProps } from '../base-control-props';
import { BaseDisplayProps } from '../data-props/base-display-props';

const columnsProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION,
  LAYOUT_CONTROL_PROPS_TYPES.COLUMNS,
  LAYOUT_CONTROL_PROPS_TYPES.AUTO_ADJUST_COLUMNS,
];
const HTMLComponentProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  LAYOUT_CONTROL_PROPS_TYPES.TAG,
  LAYOUT_CONTROL_PROPS_TYPES.HTML_CONTENT,
];

export class DropableDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super([CONTROL_PROPS_TYPES.CUSTOM_CLASS, LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION]);
    this.fillInProps(props);
    if (props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS]) {
      this.modifyPropValue(
        LAYOUT_CONTROL_PROPS_TYPES.COLUMNS,
        props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].map((col) => ({
          ...col,
          id: col.id ? col.id : ['row', generateRandomId()].join('-'),
        })),
      );
    }
  }
}
export class ContainerDisplayBlock extends BaseDisplayProps {
  constructor(props) {
    super([LAYOUT_CONTROL_PROPS_TYPES.TITLE]);
    this.fillInProps(props);
  }
}

export class ColumnsDisplayProps extends BaseDisplayProps {
  constructor(type, props) {
    const propsList = columnsProps;
    if ([LAYOUT_TYPES.SECTION, LAYOUT_TYPES.EDIT_GRID].includes(type)) {
      propsList.push(CONTROL_PROPS_TYPES.HIDE_LABEL);
    }
    super(propsList);
    this.fillInProps(props);
    if (props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS]) {
      this.modifyPropValue(
        LAYOUT_CONTROL_PROPS_TYPES.COLUMNS,
        props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].map((col) => ({
          ...col,
          id: col.id ? col.id : ['row', generateRandomId()].join('-'),
        })),
      );
    }
    if ([LAYOUT_TYPES.EDIT_GRID, LAYOUT_TYPES.CONTAINER].includes(type)) {
      this.hideProp(LAYOUT_CONTROL_PROPS_TYPES.COLUMNS);
      this.hideProp(LAYOUT_CONTROL_PROPS_TYPES.AUTO_ADJUST_COLUMNS);
    }
  }
}

export class HTMLComponentDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(HTMLComponentProps);
    this.fillInProps(props);
  }
}
