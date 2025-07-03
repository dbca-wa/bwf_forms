import { CONTROL_VALIDATION_PROPS_TYPES, DATE_DATA_PROPS_TYPES } from '../controls/utils/control-props-types';
import { ELEMENT_TYPES } from '../controls/utils/element-types';
import * as EmailValidator from 'email-validator';

export const runInputFieldValidations = (value, control) => {
  const validationProps = control.getPropsObject();
  const errors = [];
  const strValue = value?.toString() ?? '';

  validateEmail(value, control, errors);

  if (validationProps[CONTROL_VALIDATION_PROPS_TYPES.REQUIRED]) {
    if (control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ && validationProps[DATE_DATA_PROPS_TYPES.IS_DATE_RANGE]) {
      if (!value[0] || !value[1]) {
        errors.push('Please select a valid date range');
        return errors;
      } else if (value[0] && value[1] && value[0] > value[1]) {
        errors.push('Start date must be before end date');
        return errors;
      }
    } else if ((typeof value === 'boolean' && !value) || value === null || strValue.length === 0) {
      errors.push('This field is required');
      return errors;
    }
  }

  const pattern = validationProps[CONTROL_VALIDATION_PROPS_TYPES.REGEX]?.trim();
  if (pattern) {
    const regex = new RegExp([pattern.startsWith('^') ? '' : '^', pattern, pattern.endsWith('$') ? '' : '$'].join(''));
    if (!regex.test(value)) {
      errors.push("This value doesn't match the pattern " + pattern);
      return errors;
    }
  }

  const minTextLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_LENGTH];
  if (minTextLength) {
    if (strValue.length < minTextLength) {
      errors.push(`Minimum length is ${minTextLength}`);
    }
  }
  const maxLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_LENGTH];
  if (maxLength) {
    if (strValue.length > maxLength) {
      errors.push(`You have exceeded the maximum length: ${maxLength} characters`);
    }
  }
  const minWordLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_WORD_LENGTH];
  if (minWordLength) {
    const words = strValue.split(' ');
    if (words.length < minWordLength) {
      errors.push(`Please, type at least ${minWordLength} word${minWordLength > 1 ? 's' : ''}`);
    }
  }
  const maxWordLength = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_WORD_LENGTH];
  if (maxWordLength) {
    const words = strValue.split(' ');
    if (words.length > maxWordLength) {
      errors.push(`Please, use up to ${maxWordLength} word${maxWordLength > 1 ? 's' : ''}`);
    }
  }
  const minChecked = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED];
  if (minChecked) {
    if (value.length < minChecked) {
      errors.push(
        validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_CHECKED_ERROR_MESSAGE] ||
          `Please, select at least ${minChecked} option${minChecked > 1 ? 's' : ''}`,
      );
    }
  }
  const maxChecked = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED];
  if (maxChecked) {
    if (value.length > maxChecked) {
      errors.push(
        validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_CHECKED_ERROR_MESSAGE] ||
          `Select no more than ${maxChecked} option${maxChecked > 1 ? 's' : ''}`,
      );
    }
  }

  const minValue = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MIN_VALUE];
  if (minValue) {
    if (value === undefined || value === null || typeof value != 'number') {
      errors.push(`Invalid value`);
    }
    if (value < minValue) {
      errors.push(`The minimum value is ${minValue}`);
    }
  }
  const maxValue = validationProps[CONTROL_VALIDATION_PROPS_TYPES.MAX_VALUE];
  if (maxValue) {
    if (value === undefined || value === null || typeof value != 'number') {
      errors.push(`Invalid value`);
    }
    if (value > maxValue) {
      errors.push(`The maximum value is ${maxValue}`);
    }
  }
  return errors;
};

const validateEmail = (value, control, errors) => {
  if (control.type != ELEMENT_TYPES.EMAIL) return;
  if (value && !EmailValidator.validate(value)) {
    errors.push('Enter a valid email address');
  }
};

export const validateDatesEdges = (startDate, endDate, minDate, maxDate) => {
  const errors = [];
  if (!startDate && !endDate && !minDate && !maxDate) return errors;
  if (minDate && maxDate) {
    if (minDate > maxDate) {
      errors.push('The Min date must be earlier than the Max date');
    }
  }
  if (startDate && maxDate) {
    if (startDate > maxDate) {
      errors.push("The start date can't be later than the Max date");
    }
  }
  if (startDate && minDate) {
    if (startDate < minDate) {
      errors.push("The start date can't be earlier than the Min date");
    }
  }
  if (startDate && endDate) {
    if (startDate > endDate) {
      errors.push('The start date must be earlier or the same as the End date');
    }
  }
  if (endDate && maxDate) {
    if (endDate > maxDate) {
      errors.push("The End date can't be later than the Max date");
    }
  }
  if (endDate && minDate) {
    if (endDate < minDate) {
      errors.push("The End date can't be earlier than the Min date");
    }
  }
  return errors;
};
