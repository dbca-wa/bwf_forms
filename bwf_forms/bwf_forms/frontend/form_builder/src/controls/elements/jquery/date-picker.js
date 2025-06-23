import { InputFieldDisplayProps } from '../../config-properties/display-props/input-display-properties';
import {
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
  DATE_DATA_PROPS_TYPES,
} from '../../utils/control-props-types';
import { DatePickerDataProperties } from '../../config-properties/data-props/data-properties';
import { ELEMENT_TYPES } from '../../utils/element-types';
import InputElement from '../input-element';
import { DatePickerValidationProps } from '../../config-properties/validation-props/date-picker-validation-properties';
import { getDatepickerOptionsFromProps, getFixedDateSetup, getRelativeDateValue } from '../../../js/control-utils';
import { INPUT_TYPES } from '../../utils/input-types';

const defaultSettings = {
  type: 'text',
  value: '',
  [CONTROL_PROPS_TYPES.PLACEHOLDER]: 'Enter a value here',
  [CONTROL_PROPS_TYPES.LABEL]: 'Text field',
};

export default class DatePicker extends InputElement {
  constructor(attr = {}, props = {}) {
    let _props = Object.assign({}, defaultSettings, props);
    super(attr, _props, ELEMENT_TYPES.DATE_PICKER_JQ);
    this.setup();
  }

  afterRender() {
    const control = this;
    const props = this.getPropsObject();

    const datePickerOptions = getDatepickerOptionsFromProps(props, true);

    $(this.getIdSelector())
      .datepicker({
        ...datePickerOptions,
      })
      .on('change', { control, props, datePickerOptions }, function (event) {
        const { control, props, datePickerOptions } = event.data;
        const date = $(this).datepicker('getDate');
        if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
          const endDateElm = $(control.getIdSelector() + '-end');
          if (date) {
            setTimeout(() => {
              endDateElm.datepicker('show');
            }, 100);
            if (endDateElm.datepicker('getDate')) {
              control.validateValue();
            }
          }
        }
      });
    if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
      const endDatePickerOptions = getDatepickerOptionsFromProps(props);

      $(this.getIdSelector() + '-end')
        .datepicker({
          ...endDatePickerOptions,
        })
        .on('change', { control, props, datePickerOptions }, function (event) {
          const { control, props, datePickerOptions } = event.data;
          control.validateValue();
        });
    }
  }

  setup() {
    this.elementType = ELEMENT_TYPES.DATE_PICKER_JQ;
    this.type = ELEMENT_TYPES.INPUT;

    this.displayControlProps = new InputFieldDisplayProps(INPUT_TYPES.DATE, this.props);
    this.dataControlProps = new DatePickerDataProperties(this.props);
    this.validationControlProps = new DatePickerValidationProps(ELEMENT_TYPES.DATE_PICKER_JQ, this.props);
    this.attr['class'] = 'form-control';
  }

  modifyProps(props) {
    const values = {
      [DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]: getRelativeDateValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]),
      [DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END]: getRelativeDateValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END]),
      [CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]: getRelativeDateValue(props[CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]),
      [CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]: getRelativeDateValue(props[CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]),
    };
    Object.assign(props, values);
  }

  getDefaultValue() {
    const props = this.getPropsObject();
    if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
      return [
        getRelativeDateValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]),
        getRelativeDateValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END]),
      ];
    }
    return getRelativeDateValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]);
  }

  setInitialValue(value) {
    try {
      if (Array.isArray(value) && value.length === 2) {
        const [start, end] = value;
        this.dataControlProps.modifyPropValue(DATE_DATA_PROPS_TYPES.DEFAULT_VALUE, getFixedDateSetup(new Date(start)));
        this.dataControlProps.modifyPropValue(
          DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END,
          getFixedDateSetup(new Date(end)),
        );
      } else {
        if (typeof value === 'string') {
          this.dataControlProps.modifyPropValue(
            DATE_DATA_PROPS_TYPES.DEFAULT_VALUE,
            getFixedDateSetup(new Date(value)),
          );
        } else if (value instanceof Date) {
          this.dataControlProps.modifyPropValue(DATE_DATA_PROPS_TYPES.DEFAULT_VALUE, getFixedDateSetup(value));
        }
      }
    } catch (error) {
      console.error('Error setting initial value', { error, value });
    }
  }
}
