import { add, endOfMonth, endOfWeek, endOfYear, format, startOfMonth, startOfWeek, startOfYear, sub } from 'date-fns';

import {
  DATE_CONTROL_PROP_TYPES,
  RELATIVE_DATE_TYPES,
  DATE_PERIOD_CONDITIONS,
  DATE_PERIOD_RANGE_TYPES,
  DATE_PERIOD_TYPES,
  GENERAL_DATE_FORMAT,
} from '../controls/utils/constants';
import { Tooltip } from 'bootstrap';
import { CONTROL_VALIDATION_PROPS_TYPES, DATE_DATA_PROPS_TYPES } from '../controls/utils/control-props-types';

export const activateTooltips = (parent, selector = '') => {
  if (!parent) return;
  if (parent instanceof $) parent = parent[0];

  const tooltipTriggerList = parent.querySelectorAll((selector ?? '').concat(' [data-bs-toggle="tooltip"]'));
  [...tooltipTriggerList].map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
};

export const getDatepickerOptionsFromProps = (props, isStartDate = false) => {
  const options = {
    changeMonth: true,
    changeYear: true,
    dateFormat: 'dd-mm-yy',
    yearRange: 'c-100:c+10',
  };
  const isDateRange = props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE];

  let maxDate = getRelativeDateFromValue(props[CONTROL_VALIDATION_PROPS_TYPES.MAX_DATE]);
  let minDate = getRelativeDateFromValue(props[CONTROL_VALIDATION_PROPS_TYPES.MIN_DATE]);
  let defaultDate = getRelativeDateFromValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE]);
  let defaultEndDate = getRelativeDateFromValue(props[DATE_DATA_PROPS_TYPES.DEFAULT_VALUE_END]);

  if (isDateRange && !isStartDate) {
    if (defaultDate && !minDate) {
      minDate = defaultDate;
    }
  }

  options.defaultDate = isStartDate ? (defaultDate ? defaultDate : null) : defaultEndDate ? defaultEndDate : null;

  if (props[DATE_DATA_PROPS_TYPES.DISABLE_WEEKENDS] == true) {
    options.beforeShowDay = $.datepicker.noWeekends;
  }

  if (minDate) {
    options.minDate = minDate;
  }
  if (maxDate) {
    options.maxDate = maxDate;
  }

  if (props[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
    options.numberOfMonths = 2;
  }
  return options;
};

export const getRelativeDateFromValue = (config) => {
  if (!config) return '';
  try {
    const { type, relative, condition } = config;

    if (type === DATE_CONTROL_PROP_TYPES.FIXED.value) {
      const { date } = config;
      if (!date) return '';
      return new Date(date);
    } else {
      const today = new Date();
      let date = today;

      switch (relative) {
        case RELATIVE_DATE_TYPES.TODAY.value:
          date = today;
          break;
        case RELATIVE_DATE_TYPES.TOMORROW.value:
          date = add(today, { days: 1 });
          break;
        case RELATIVE_DATE_TYPES.YESTERDAY.value:
          date = sub(today, { days: 1 });
          break;

        case RELATIVE_DATE_TYPES.CONDITION.value:
          const { condition: cond, range, number, period } = condition;
          let n = getDifferenceValue(range, number ?? 0);

          const periodDiff = getPeriodDifference(period, n);
          if (
            [
              DATE_PERIOD_RANGE_TYPES.THIS.value,
              DATE_PERIOD_RANGE_TYPES.NEXT.value,
              DATE_PERIOD_RANGE_TYPES.NEXT_N.value,
            ].includes(range)
          ) {
            date = add(today, periodDiff);
          } else {
            date = sub(today, periodDiff);
          }
          date = getFilteredDate(date, cond, period);

        default:
          break;
      }
      return date;
    }
  } catch (error) {
    console.error('Error in getRelativeDateValue', error);
    return '';
  }
};

export const getRelativeDateValue = (config, dateFormat = GENERAL_DATE_FORMAT) => {
  const date = getRelativeDateFromValue(config);
  if (date) return format(date, dateFormat);
  return '';
};

export const getFixedDateSetup = (date) => {
  return { type: DATE_CONTROL_PROP_TYPES.FIXED.value, date };
};

const getDifferenceValue = (range, number) => {
  if (range === DATE_PERIOD_RANGE_TYPES.THIS.value) {
    return 0;
  } else if (range === DATE_PERIOD_RANGE_TYPES.NEXT.value || range === DATE_PERIOD_RANGE_TYPES.PREVIOUS.value) {
    return 1;
  }
  return number;
};

const getPeriodDifference = (period, number) => {
  switch (period) {
    case DATE_PERIOD_TYPES.DAY.value:
      return { days: number };
    case DATE_PERIOD_TYPES.WEEK.value:
      return { weeks: number };
    case DATE_PERIOD_TYPES.MONTH.value:
      return { months: number };
    case DATE_PERIOD_TYPES.YEAR.value:
      return { years: number };
    default:
      return { days: 0 };
  }
};

const getFilteredDate = (date, condition, period) => {
  switch (condition) {
    case DATE_PERIOD_CONDITIONS.START_OF.value:
      switch (period) {
        case DATE_PERIOD_TYPES.DAY.value:
          return date;
        case DATE_PERIOD_TYPES.WEEK.value:
          return startOfWeek(date);
        case DATE_PERIOD_TYPES.MONTH.value:
          return startOfMonth(date);
        case DATE_PERIOD_TYPES.YEAR.value:
          return startOfYear(date);
        default:
          return date;
      }
    case DATE_PERIOD_CONDITIONS.END_OF.value:
      switch (period) {
        case DATE_PERIOD_TYPES.DAY.value:
          return date;
        case DATE_PERIOD_TYPES.WEEK.value:
          return endOfWeek(date);
        case DATE_PERIOD_TYPES.MONTH.value:
          return endOfMonth(date);
        case DATE_PERIOD_TYPES.YEAR.value:
          return endOfYear(date);
        default:
          return date;
      }
    default:
      return date;
  }
};
