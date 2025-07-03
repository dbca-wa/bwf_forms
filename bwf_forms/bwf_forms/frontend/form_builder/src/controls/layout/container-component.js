import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
import { LAYOUT_TYPES } from '../utils/layout-types';
import { RowBlock } from './row-block';

const defaultSettings = {
  columns: [
    {
      size: 'lg',
      width: 12,
    },
  ],
};

export class ContainerBlock extends RowBlock {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
  }

  setup() {
    this.elementType = LAYOUT_TYPES.CONTAINER;

    this.displayControlProps = new ColumnsDisplayProps(this.elementType, this.props);
    this.dataControlProps = null;

    if (!this.initialSetupWithChildren()) {
      this.initialColumnsSetup();
    }
  }
}
