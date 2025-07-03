import { BuildArea } from '../../js/fb-build-area';
import { markup } from '../../js/utils';
import { BasicAPIProps } from '../config-properties/api-props/basic-api-properties';
import { ColumnsDisplayProps } from '../config-properties/display-props/layout-display-properties';
import { CONTROL_API_PROPS_TYPES, CONTROL_PROPS_TYPES } from '../utils/control-props-types';
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

export class SectionComponent extends RowBlock {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props);
    this.container_class = 'section-component';
  }

  setup() {
    this.elementType = LAYOUT_TYPES.SECTION;

    this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] =
      this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME] ||
      BuildArea.getInstance().generateAPIFieldName(
        this.props[CONTROL_API_PROPS_TYPES.FIELD_NAME_DEFAULT] ?? this.elementType,
      );

    this.displayControlProps = new ColumnsDisplayProps(this.elementType, this.props);
    this.apiControlProps = new BasicAPIProps(LAYOUT_TYPES.SECTION, this.props);
    this.dataControlProps = null;

    if (!this.initialSetupWithChildren()) {
      this.initialColumnsSetup();
    }
  }

  render(customProps, includeDropables = false) {
    const props = customProps ?? this.getPropsObject();
    return markup(
      'div',
      [
        markup('div', props[CONTROL_PROPS_TYPES.LABEL], { class: 'section-header' }),
        markup('div', markup('div', '', { class: 'row' })),
      ],
      {
        class: this.container_class,
        id: this.id,
      },
    );
  }
}
