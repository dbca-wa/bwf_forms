import { DATASOURCE_PROPS_TYPES } from '../../utils/control-props-types';
import { BaseControlProps } from '../base-control-props';
import { DATASOURCE_VALUES, datasourceDataPropertiesStore } from '../stores/data-props-store';

const dsValues = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.VALUES];
const dsURL = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.URL];
const dsJSON = [
  DATASOURCE_PROPS_TYPES.DEFAULT_VALUE,
  DATASOURCE_PROPS_TYPES.RAW_JSON,
  DATASOURCE_PROPS_TYPES.ID_PATH,
  DATASOURCE_PROPS_TYPES.VALUE_PROPERTY,
];

export class DatasourceProperties extends BaseControlProps {
  $p;
  editor;
  constructor(type, props, parent) {
    let propsList;
    let propsStore;
    switch (type) {
      case DATASOURCE_PROPS_TYPES.VALUES:
        propsList = dsValues;
        propsStore = datasourceDataPropertiesStore[DATASOURCE_VALUES.VALUES];
        break;
      case DATASOURCE_PROPS_TYPES.URL:
        propsList = dsURL;
        propsStore = datasourceDataPropertiesStore[DATASOURCE_VALUES.URL];
        break;
      case DATASOURCE_PROPS_TYPES.RAW_JSON:
        propsList = dsJSON;
        propsStore = datasourceDataPropertiesStore[DATASOURCE_VALUES.RAW_JSON];
      default:
        propsList = dsValues;
        propsStore = datasourceDataPropertiesStore[DATASOURCE_VALUES.VALUES];
        break;
    }

    super(propsList, propsStore);
    this.fillInProps(props);
  }

  setEditor(parentContainer, editor) {
    this.$p = parentContainer;
    this.editor = editor;
  }

  clearEditor() {
    this.$p = null;
  }

  defaultEvents() {}

  renderInParent() {
    if (this.$p) {
      this.$p.empty().append(this.render());
      super.addChangeEvents(this, this._onDataPropsChange);
    }
  }

  addChangeEvents(context, cb) {
    super.addChangeEvents(context, cb);
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;

    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    _this.editor.initialProps[prop.name] = value;
  }

  render() {
    const container = super.render();

    if (this.datasourceProperties) {
      container.appendChild(this.datasourceProperties.render());
    }

    return container;
  }
}
