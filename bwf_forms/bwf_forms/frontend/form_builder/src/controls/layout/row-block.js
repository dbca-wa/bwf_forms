import { BuildArea } from '../../js/fb-build-area';
import { markup } from '../../js/utils';
import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
import LayoutControl from '../fb-layout-control';
import { CONTROL_PROPS_TYPES, LAYOUT_CONTROL_PROPS_TYPES } from '../utils/control-props-types';
import { CONTROL_TYPES } from '../utils/control-types';
import { LAYOUT_TYPES } from '../utils/layout-types';

const defaultSettings = {
  [LAYOUT_CONTROL_PROPS_TYPES.DISPLAY_DIRECTION]: 'row',
};

export class RowBlock extends LayoutControl {
  elementType = LAYOUT_TYPES.ROW_COLUMNS;
  dropableType = 'dropable';

  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, CONTROL_TYPES.LAYOUT);

    this.container_class = 'row';
    this.dataControlProps = null;
    this.setup();
  }
  setup() {
    this.container_class = 'row';
    this.displayControlProps = new ColumnsDisplayProps(this.elementType, this.props);

    if (!this.initialSetupWithChildren()) {
      this.initialColumnsSetup();
    }
  }

  initialSetupWithChildren() {
    if (this.props?.children) {
      const props = this.displayControlProps.getPropsValues();
      this.setChildrenFromProps();
      const columnsData = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS];
      for (let i = 0; i < this.children.length; i++) {
        const dropable = this.children[i];
        BuildArea.getInstance().registerDropable(dropable.areaId, dropable);
        dropable.id = dropable.areaId;
        columnsData[i].id = dropable.id;
      }
      this.displayControlProps.modifyPropValue(LAYOUT_CONTROL_PROPS_TYPES.COLUMNS, columnsData);
      return true;
    }
    return false;
  }

  initialColumnsSetup() {
    const props = this.displayControlProps.getPropsValues();
    const autoAdjustColumns = props[LAYOUT_CONTROL_PROPS_TYPES.AUTO_ADJUST_COLUMNS];
    const children = this.children || [];
    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const { id, size, width } = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      if (children.length > i) {
        const colData = children[i];
        const dropable = BuildArea.getInstance().getDropableControl(this.areaId, {
          props: {
            id: id,
            dropableType: this.dropableType,
            [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: `col${autoAdjustColumns ? '' : `-${size}-${width}`}`,
            ...colData.props,
          },
        });

        this.children.push(dropable);
      } else {
        const dropable = BuildArea.getInstance().getDropableControl(this.areaId, {
          id,
          areaId: id,
          dropableType: this.dropableType,
          [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: `col${autoAdjustColumns ? '' : `-${size}-${width}`}`,
        });
        this.children.push(dropable);
      }
    }
  }

  renderInParent(parent = null) {
    if (parent) this.setParent(parent);
    if (this.$p) {
      const props = this.displayControlProps.getPropsValues();
      const autoAdjustColumns = props[LAYOUT_CONTROL_PROPS_TYPES.AUTO_ADJUST_COLUMNS];

      this.$p.empty().append(this.renderControl(props));
      const container = this.$p.find('.row')?.first() ?? this.$p.find(this.getIdSelector());

      for (let i = 0; i < this.children.length; i++) {
        const dropable = this.children[i];
        const { id, size, width } = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];

        dropable.props[CONTROL_PROPS_TYPES.CUSTOM_CLASS] = `col${autoAdjustColumns ? '' : `-${size}-${width}`}`;
        dropable.setContainer(container, true);
      }
    }
  }

  toDisplay(container) {
    const parent = this.render();
    container.append(parent);
    const row = $(parent).find('.row')?.first();

    for (let i = 0; i < this.children.length; i++) {
      const column = this.children[i];
      column.toDisplay(row);
    }
  }

  renderControl(isDisplayMode = false) {
    const _this = this;
    const props = _this.getPropsObject();
    props[CONTROL_PROPS_TYPES.HIDE_LABEL] = false;
    const autoAdjustColumns = props[LAYOUT_CONTROL_PROPS_TYPES.AUTO_ADJUST_COLUMNS];
    const existingDropableIds = [..._this.children.map((child) => child.id)];
    const tmpchildren = [];

    for (let i = 0; i < props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS].length; i++) {
      const { id, size, width } = props[LAYOUT_CONTROL_PROPS_TYPES.COLUMNS][i];
      const dropable = _this.children.find((child) => child.id === id);
      if (dropable) {
        dropable.displayControlProps.modifyPropValue(
          CONTROL_PROPS_TYPES.CUSTOM_CLASS,
          `col${autoAdjustColumns ? '' : `-${size}-${width}`}`,
        );
        tmpchildren.push(dropable);
        existingDropableIds.splice(existingDropableIds.indexOf(id), 1);
      } else {
        const dropable = BuildArea.getInstance().getDropableControl(_this.areaId, {
          id: id,

          dropableType: this.dropableType,
          areaId: id,
          [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: `col${autoAdjustColumns ? '' : `-${size}-${width}`}`,
        });
        tmpchildren.push(dropable);
      }
    }
    _this.children = tmpchildren;
    existingDropableIds.forEach((id) => {
      BuildArea.getInstance().removeDropable(id);
    });

    return this.render(props, true);
  }

  render(customProps, includeDropables = false) {
    const nodes = [];
    nodes.push(markup('div', '', { class: 'row' }));

    return markup('div', nodes, { class: this.container_class, id: this.id });
  }
}
