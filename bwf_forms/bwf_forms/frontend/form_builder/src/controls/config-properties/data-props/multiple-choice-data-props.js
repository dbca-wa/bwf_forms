import Handlebars from 'handlebars';

import { CONTROL_DATA_PROPS_TYPES, DATASOURCE_PROPS_TYPES } from '../../utils/control-props-types';
import { ELEMENT_TYPES } from '../../utils/element-types';
import { INPUT_TYPES } from '../../utils/input-types';
import { BaseControlProps } from '../base-control-props';
import { DATASOURCE_VALUES, datasourceDataPropertiesStore } from '../stores/data-props-store';
import { BaseDataProps } from './base-data-props';

export class MultipleChoiceDataProperties extends BaseDataProps {
  datasource;

  constructor(props, dataProps = defMultiChoiceProps) {
    super(dataProps);
    this.fillInProps(props);
    this.selectDatasource(this.props[CONTROL_DATA_PROPS_TYPES.DATASOURCE]?.prop.value);
    this.prepareDatasourceData(props);
  }

  prepareDatasourceData(props) {
    this.datasourceProperties.fillInProps(props);
    if (this.datasource === DATASOURCE_PROPS_TYPES.VALUES) {
      this.datasourceProperties.modifyProp(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, {
        options: [...props.values] ?? [],
      });
    } else if (this.datasource === DATASOURCE_PROPS_TYPES.RAW_JSON) {
      try {
        const parsed = JSON.parse(this.datasourceProperties.props[DATASOURCE_PROPS_TYPES.RAW_JSON].prop.value);
        if (Array.isArray(parsed)) {
          this.datasourceProperties.modifyPropValue(DATASOURCE_PROPS_TYPES.JSON_VALUE, parsed);
          this.datasourceProperties.modifyProp(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, {
            options: parsed ?? [],
            value: props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE] ?? [],
          });
        }
      } catch (error) {}
    }
    this.applyItemTemplateToDefaultValues();
  }

  fillInProps(hostProps) {
    super.fillInProps(hostProps);
    if (this.datasourceProperties) {
      this.datasourceProperties.fillInProps(hostProps);
    }
  }

  getPropsValues() {
    const props = super.getPropsValues();
    if (this.datasourceProperties) {
      Object.assign(props, this.datasourceProperties.getPropsValues());
    }
    return props;
  }

  selectDatasource(selectedDS) {
    this.datasource = selectedDS;
    this.modifyPropValue(CONTROL_DATA_PROPS_TYPES.DATASOURCE, selectedDS);
    if (selectedDS === DATASOURCE_VALUES.VALUES) {
      this.datasourceProperties = new BaseControlProps(
        dsValues,
        datasourceDataPropertiesStore[DATASOURCE_VALUES.VALUES],
      );
    } else if (selectedDS === DATASOURCE_VALUES.URL) {
      this.datasourceProperties = new BaseControlProps(dsURL, datasourceDataPropertiesStore[DATASOURCE_VALUES.URL]);
    } else if (selectedDS === DATASOURCE_VALUES.RAW_JSON) {
      this.datasourceProperties = new BaseControlProps(
        dsJSON,
        datasourceDataPropertiesStore[DATASOURCE_VALUES.RAW_JSON],
      );
    }
  }

  renderInParent() {
    if (this.$p) {
      this.$p.empty().append(this.render());
      super.addChangeEvents(this, this._onDataPropsChange);
      this.datasourceProperties.addChangeEvents(this, this._onDataPropsChange);
    }
  }

  renderProp(prop) {
    const renderedProp = this.$p.find(`#${prop.id}`).closest('.control-prop');
    renderedProp.after(prop.renderProp());
    renderedProp.remove();
    prop.addChangeEvent(this, this._onDataPropsChange);
  }

  addChangeEvents(context, cb) {
    super.addChangeEvents(context, cb);
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;

    const value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;
    // This works because props names should always be different.
    _this.datasourceProperties.modifyPropValue(prop.name, value);
    _this.modifyPropValue(prop.name, value);

    if (this.id === 'cp-dataSource') {
      _this.selectDatasource(value);
      _this.prepareDatasourceData(_this.getPropsValues());
      _this.renderInParent();
    }

    if (prop.name === DATASOURCE_PROPS_TYPES.VALUES) {
      // _this.datasourceProperties.fillInProps(_this.editor.initialProps);
      _this.editor._renderPreviewControl();
      if (_this.datasource === DATASOURCE_PROPS_TYPES.VALUES) {
        _this.datasourceProperties.modifyProp(DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, { options: value });
        _this.datasourceProperties.modifyPropValue(DATASOURCE_PROPS_TYPES.VALUE_PROPERTY, 'value');
        _this.renderProp(_this.datasourceProperties.props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]);
        _this.editor._renderPreviewControl();
        _this.applyItemTemplateToDefaultValues(true);
        return;
      }
    }
    if (prop.name === DATASOURCE_PROPS_TYPES.DEFAULT_VALUE) {
      if (_this.initialProps?.type === ELEMENT_TYPES.SELECT_BOXES) {
        const values = [];
        document.querySelectorAll(`input[type="checkbox"][name="${e.target.name}"]`).forEach((el) => {
          if (el.checked) {
            values.push(el.value);
          }
        });
        _this.datasourceProperties.modifyPropValue(prop.name, values);
      } else {
        _this.datasourceProperties.modifyPropValue(prop.name, value);
      }
      _this.editor._renderPreviewControl();
      return;
    }
    if ([CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE, DATASOURCE_PROPS_TYPES.VALUE_PROPERTY].includes(prop.name)) {
      _this.applyItemTemplateToDefaultValues(true);
      _this.editor._renderPreviewControl();
    }
    if (prop.name === DATASOURCE_PROPS_TYPES.RAW_JSON) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          _this.datasourceProperties.modifyPropValue(DATASOURCE_PROPS_TYPES.JSON_VALUE, parsed);
          _this.renderProp(_this.datasourceProperties.props[DATASOURCE_PROPS_TYPES.JSON_VALUE]);
          _this.applyItemTemplateToDefaultValues(true);
        }

        _this.editor._renderPreviewControl();
      } catch (error) {
        console.error(error);
      }
    }
    // console.log(_this.datasourceProperties.getPropsValues());
  }

  applyItemTemplateToDefaultValues(render = false) {
    try {
      const values = this.getPropsValues();
      const valueProperty = values[DATASOURCE_PROPS_TYPES.VALUE_PROPERTY] || 'value';
      const dataProp = values.hasOwnProperty(DATASOURCE_PROPS_TYPES.VALUES)
        ? DATASOURCE_PROPS_TYPES.VALUES
        : DATASOURCE_PROPS_TYPES.JSON_VALUE;
      const items = values[dataProp];
      const template = Handlebars.compile(values[CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE]);
      const parser = new DOMParser();

      this.datasourceProperties.modifyProp(DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, {
        options: items.map((item) => {
          let text = '';

          try {
            const content = template({ item });
            const htmlDoc = parser.parseFromString(content, 'text/html');
            htmlDoc.body.childNodes.forEach((node) => {
              text += node.innerText;
            });
          } catch (error) {
            text = item.text;
          }
          return {
            value: item[valueProperty],
            text,
          };
        }),
      });
      if (render) this.renderProp(this.datasourceProperties.props[DATASOURCE_PROPS_TYPES.DEFAULT_VALUE]);
    } catch (error) {}
  }

  render() {
    const container = super.render();

    if (this.datasourceProperties) {
      container.appendChild(this.datasourceProperties.render());
    }

    return container;
  }
}

const dsValues = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.VALUES];
const dsURL = [DATASOURCE_PROPS_TYPES.DEFAULT_VALUE, DATASOURCE_PROPS_TYPES.URL];
const dsJSON = [
  DATASOURCE_PROPS_TYPES.DEFAULT_VALUE,
  DATASOURCE_PROPS_TYPES.JSON_VALUE,
  DATASOURCE_PROPS_TYPES.VALUE_PROPERTY,
  DATASOURCE_PROPS_TYPES.RAW_JSON,
  DATASOURCE_PROPS_TYPES.ID_PATH,
];
const defMultiChoiceProps = [
  CONTROL_DATA_PROPS_TYPES.MULTI,
  CONTROL_DATA_PROPS_TYPES.DATASOURCE,
  CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE,
];
