import {
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  DATASOURCE_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
  FILE_DATA_PROPS_TYPES,
} from '../../utils/control-props-types';
import { INPUT_TYPES } from '../../utils/input-types';
import { dateDataPropertiesStore } from '../stores/data-props-store';
import { BaseDataProps } from './base-data-props';
import { MultipleChoiceDataProperties } from './multiple-choice-data-props';

const defProps = [CONTROL_DATA_PROPS_TYPES.MULTI, CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];

const selectelementProps = [
  CONTROL_DATA_PROPS_TYPES.MULTI,
  CONTROL_DATA_PROPS_TYPES.DATASOURCE,
  CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE,
];
const radioButtonProps = [CONTROL_DATA_PROPS_TYPES.DATASOURCE, CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE];
const selectBoxesProps = [CONTROL_DATA_PROPS_TYPES.DATASOURCE, CONTROL_DATA_PROPS_TYPES.ITEM_TEMPLATE];

export class BasicDataProperties extends BaseDataProps {
  datasourceProperties;

  constructor(props) {
    super(defProps);
    this.fillInProps(props);
  }
}

export class InputFieldDataProperties extends BaseDataProps {
  datasourceProperties;

  constructor(type = INPUT_TYPES.TEXT, props) {
    const definition = [];

    definition.push(...getInputDataProps(type));

    super(definition);
    this.fillInProps(props);

    this.modifyProp(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, {
      type: type === INPUT_TYPES.CHECK_BOX ? 'boolean' : type === INPUT_TYPES.TEXT ? 'string' : type,
    });
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    let value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;
    if (prop.type === 'multi-select' && e.target) {
      value = Array.from(e.target.selectedOptions).map((option) => option.value);
    }
    // Remove whitespaces
    if ([FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE, FILE_DATA_PROPS_TYPES.FILE_MIN_SIZE].includes(prop.name)) {
      value = value.replace(' ', '');
    }
    _this.modifyPropValue(prop.name, value);

    _this.editor._renderPreviewControl();
  }
}

export class SelectDataProperties extends MultipleChoiceDataProperties {
  constructor(props) {
    super(props, selectelementProps);
  }
}

export class RadioButtonsDataProperties extends MultipleChoiceDataProperties {
  constructor(props) {
    super(props, radioButtonProps);
  }
}

export class SelectBoxesDataProperties extends MultipleChoiceDataProperties {
  constructor(props) {
    super(props, selectBoxesProps);
    if ([DATASOURCE_PROPS_TYPES.VALUES, DATASOURCE_PROPS_TYPES.RAW_JSON].includes(this.datasource)) {
      this.datasourceProperties.modifyProp(CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE, {
        type: 'select-boxes',
      });
    }
  }
}

export class DatePickerDataProperties extends BaseDataProps {
  constructor(props) {
    const definition = [
      // DATE_DATA_PROPS_TYPES.ENABLE_DATE_INPUT,
      // DATE_DATA_PROPS_TYPES.ENABLE_TIME_INPUT,
      DATE_DATA_PROPS_TYPES.DISABLE_WEEKENDS,
      DATE_DATA_PROPS_TYPES.IS_DATE_RANGE,
      DATE_DATA_PROPS_TYPES.DEFAULT_VALUE,
      DATE_DATA_PROPS_TYPES.PLACEHOLDER_END,
      DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END,

      // DATE_DATA_PROPS_TYPES.DISABLE_WEEKDAYS,
      // DATE_DATA_PROPS_TYPES.HOUR_FORMAT,
    ];

    super(definition, dateDataPropertiesStore);
    this.fillInProps(props);

    this.modifyLocalProps();
  }

  modifyLocalProps() {
    const isDateRange = this.props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]?.prop?.value;
    this.modifyPropVisibility(DATE_DATA_PROPS_TYPES.PLACEHOLDER_END, !isDateRange);
    this.modifyPropVisibility(DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END, !isDateRange);
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;
    _this.modifyPropValue(prop.name, value);

    if (prop.name === DATE_DATA_PROPS_TYPES.IS_DATE_RANGE) {
      _this.modifyPropVisibility(DATE_DATA_PROPS_TYPES.PLACEHOLDER_END, !value);
      _this.modifyPropVisibility(DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END, !value);
      _this.renderInParent();
    }
    _this.editor._renderPreviewControl();
  }
}

const fileProps = [
  FILE_DATA_PROPS_TYPES.MULTIPLE_FILES,
  FILE_DATA_PROPS_TYPES.FILE_FORMATS,
  FILE_DATA_PROPS_TYPES.DISPLAY_AS_IMAGES,
  FILE_DATA_PROPS_TYPES.FILE_MIN_SIZE,
  FILE_DATA_PROPS_TYPES.FILE_MAX_SIZE,
  FILE_DATA_PROPS_TYPES.FILE_TYPES,
];

function getInputDataProps(type) {
  switch (type) {
    case INPUT_TYPES.PASSWORD:
      return [];
    case INPUT_TYPES.FILE_UPLOAD:
      return fileProps;
    default:
      return defProps;
  }
}
