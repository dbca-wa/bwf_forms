import { capitalize, markup } from '../../../js/utils';
import {
  DATE_CONTROL_PROP_TYPES,
  DATE_PERIOD_CONDITIONS,
  RELATIVE_DATE_TYPES,
  DATE_PERIOD_TYPES,
  DATE_PERIOD_RANGE_TYPES,
} from '../../utils/constants';
import { _renderProp } from '../control-prop';

export class DynamicDateControl {
  id;
  sortable = false;
  changeHandler;

  fixedRadioId;
  relativeRadioId;
  valueType;
  valueDate;
  dynamicValue;

  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.value = props.value;

    this.mainButtonsName = this.id + '-' + this.name;
    this.relativeButtonsName = this.id + '-' + this.name + '-relative';

    this.conditionDateRenderId = `${this.id}-relative-${RELATIVE_DATE_TYPES.CONDITION.value}-render`;
    this.setup();
  }

  setup() {
    this.fixedRadioId = this.id + '-fixed';
    this.relativeRadioId = this.id + '-relative';
  }

  notifyValueChange(value) {
    this.changeHandler.fn({
      data: { ...this.changeHandler.context },
      value: this.valueType
        ? {
            type: this.valueType,
            ...value,
          }
        : '',
    });
  }

  addChangeEventHandler({ fn, context }) {
    this.changeHandler = {
      fn,
      context,
    };

    $(`#${this.id} input[type="radio"][name="${this.mainButtonsName}"]`).on('change', this, (e) => {
      const _this = e.data;
      const value = e.target.value;
      _this.handleDateTypeChange(value);
    });
    $(`#${this.id} input[type="radio"][name="${this.relativeButtonsName}"]`).on('change', this, (e) => {
      const _this = e.data;
      const value = e.target.value;
      _this.handleRelativeDateChange(value);
    });

    $(`#${this.fixedRadioId}-render input`).on('change', this, (e) => {
      const _this = e.data;
      const value = e.target.value;
      _this.valueDate = value;
      _this.notifyValueChange({ date: value });
    });
    $(`#${this.id}-condition-range`).on('change', this, (e) => {
      const _this = e.data;
      const value = e.target.value;
      if ([DATE_PERIOD_RANGE_TYPES.LAST_N.value, DATE_PERIOD_RANGE_TYPES.NEXT_N.value].includes(value)) {
        $(`#${this.id}-condition-range-render`).show();
      } else {
        $(`#${this.id}-condition-range-render`).hide();
      }
    });
    $(`#${this.id + '-relative-' + RELATIVE_DATE_TYPES.CONDITION.value}-render select`).on('change', this, (e) => {
      const _this = e.data;
      _this.handleRelativeConditionChange();
    });
    $(`#${this.id}-condition-range-render input`).on('input', this, (e) => {
      const _this = e.data;
      _this.handleRelativeConditionChange();
    });
    $(`#${this.id} button.clear-date`).on('click', this, (e) => {
      const _this = e.data;
      _this.handleDateTypeChange('');
    });

    // Initial setup
    this.handleDateTypeChange(this.value?.type);
    if (this.value?.type === DATE_CONTROL_PROP_TYPES.RELATIVE.value) {
      this.handleRelativeDateChange(this.value?.relative);
    }
  }

  handleDateTypeChange(value) {
    this.valueType = value;
    if (value === DATE_CONTROL_PROP_TYPES.FIXED.value) {
      $(`#${this.fixedRadioId}-render`).show();
      $(`#${this.relativeRadioId}-render`).hide();
      $(`#${this.id} button.clear-date`).show();

      if (this.valueDate) {
        $(`#${this.fixedRadioId}-render input`).trigger('change');
      }
    } else if (value === DATE_CONTROL_PROP_TYPES.RELATIVE.value) {
      $(`#${this.fixedRadioId}-render`).hide();
      $(`#${this.relativeRadioId}-render`).show();
      $(`#${this.id} button.clear-date`).show();
      this.handleRelativeConditionChange();
    } else if (value === '') {
      $(`#${this.id} input[type="radio"][name="${this.mainButtonsName}"]`).prop('checked', false);
      $(`#${this.fixedRadioId}-render`).hide();
      $(`#${this.relativeRadioId}-render`).hide();
      $(`#${this.id} button.clear-date`).hide();
      this.notifyValueChange(null);
    }
  }
  handleRelativeDateChange(value) {
    if (value != RELATIVE_DATE_TYPES.CONDITION.value) {
      $(`#${this.conditionDateRenderId}`).hide();
      this.notifyValueChange({ relative: value });
      return;
    } else {
      $(`#${this.conditionDateRenderId}`).show();
      this.handleRelativeConditionChange();
    }
  }

  handleRelativeConditionChange() {
    let number = $(`#${this.id}-condition-number`).val();
    this.notifyValueChange({
      relative: 'condition',
      condition: {
        condition: $(`#${this.id}-condition-condition`).val(),
        range: $(`#${this.id}-condition-range`).val(),
        number: number ? parseInt(number) : 0,
        period: $(`#${this.id}-condition-period`).val(),
      },
    });
  }

  renderFixed() {
    return markup('div', [
      markup('input', '', {
        type: 'date',
        class: 'form-control',
        value: this.value?.date,
      }),
    ]);
  }

  renderRelative() {
    const name = this.relativeButtonsName;
    const relativeRadioConfigs = Object.keys(RELATIVE_DATE_TYPES).map((key) => {
      return {
        id: this.id + '-relative-' + RELATIVE_DATE_TYPES[key].value,
        name: name,
        ...RELATIVE_DATE_TYPES[key],
        isInline: true,
        data: this.value?.relative === RELATIVE_DATE_TYPES[key].value ? { checked: true } : {},
      };
    });
    const elements = relativeRadioConfigs.map((config) => {
      return renderRadioButton(
        config,
        config.value === RELATIVE_DATE_TYPES.CONDITION.value
          ? () => {
              return this.renderConditionDate();
            }
          : null,
      );
    });

    return markup('div', elements);
  }

  renderConditionDate() {
    const conditionSelect = {
      id: `${this.id}-condition-condition`,
      options: Object.keys(DATE_PERIOD_CONDITIONS).map((key) => DATE_PERIOD_CONDITIONS[key]),
      value: this.value?.condition?.condition,
      label: 'Filter Condition',
    };
    const rangeSelect = {
      id: `${this.id}-condition-range`,
      options: Object.keys(DATE_PERIOD_RANGE_TYPES).map((key) => DATE_PERIOD_RANGE_TYPES[key]),
      value: this.value?.condition?.range,
      label: 'Range',
    };
    const periodSelect = {
      id: `${this.id}-condition-period`,
      options: Object.keys(DATE_PERIOD_TYPES).map((key) => DATE_PERIOD_TYPES[key]),
      value: this.value?.condition?.period,
      label: 'Period',
    };

    return markup(
      'div',
      [
        renderSelect(conditionSelect),
        renderSelect(rangeSelect),
        markup(
          'div',
          [
            markup('label', 'N', { for: this.id + '-condition-number', class: 'form-label' }),
            markup('input', '', {
              type: 'number',
              id: `${this.id}-condition-number`,
              class: 'form-control form-control-sm',
              style: 'max-width: 70px;',
              value: this.value?.condition?.number,
            }),
          ],
          {
            class: 'col-auto',
            id: `${this.id}-condition-range-render`,
            style: this.value?.condition?.number ? '' : 'display: none;',
          },
        ),
        renderSelect(periodSelect),
      ],
      {
        class: 'row align-items-center',
      },
    );
  }

  render() {
    const dateElement = markup('div', '', { id: this.id, class: '' });
    const name = this.mainButtonsName;

    const buttonFixed = renderRadioButton(
      {
        id: this.fixedRadioId,
        name: name,
        ...DATE_CONTROL_PROP_TYPES.FIXED,
        data: this.value?.type === DATE_CONTROL_PROP_TYPES.FIXED.value ? { checked: true } : {},
      },
      () => {
        return this.renderFixed();
      },
    );
    const buttonRelative = renderRadioButton(
      {
        id: this.relativeRadioId,
        name: name,
        ...DATE_CONTROL_PROP_TYPES.RELATIVE,
        data: this.value?.type === DATE_CONTROL_PROP_TYPES.RELATIVE.value ? { checked: true } : {},
      },
      () => {
        return this.renderRelative();
      },
    );

    const buttonClear = markup('button', 'Clear value', {
      class: 'btn btn-sm btn-outline-secondary clear-date',
      style: 'margin-left: 10px; display: none;',
      type: 'button',
    });

    dateElement.append(buttonFixed);
    dateElement.append(buttonRelative);
    dateElement.append(buttonClear);

    return dateElement;
  }
}

const renderRadioButton = (radioOptions, optionContent) => {
  const { id, name, value, label, isInline, data } = radioOptions;

  return markup(
    'div',
    [
      {
        tag: 'input',
        type: 'radio',
        id: id,
        name: name,
        value: value,
        class: 'form-check-input',
        ...data,
      },
      { tag: 'label', for: id, content: capitalize(label), class: 'form-check-label' },
      {
        tag: 'div',
        id: id + '-render',
        content: optionContent ? optionContent() : '',
        style: 'display: none;',
      },
    ],
    { class: ['form-check', isInline ? 'form-check form-check-inline' : ''].join(' ') },
  );
};

const renderSelect = (selectProps) => {
  const { id, options, value, label } = selectProps;
  const selectOptions = options.map((option) => {
    const optionElement = {
      tag: 'option',
      value: option.value,
      content: option.label,
    };
    if (option.value === value) {
      optionElement.selected = true;
    }
    return optionElement;
  });
  return markup(
    'div',
    [
      markup('label', label, { for: id, class: 'form-label' }),
      markup('select', selectOptions, { class: 'form-select form-select-sm', id }),
    ],
    { class: 'col-auto' },
  );
};
