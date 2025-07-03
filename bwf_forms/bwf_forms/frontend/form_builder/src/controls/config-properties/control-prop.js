import { markup } from '../../js/utils';
import { CONTROL_PROPS_TYPES } from '../utils/control-props-types';

import { dataPropertiesStore, dateDataPropertiesStore } from './stores/data-props-store';
import { layoutPropertiesStore } from './stores/layout-props-store';
import { propertiesStore } from './stores/props-store';
import { validationPropertiesStore } from './stores/validations-props-store';
import { apiPropertiesStore } from './stores/api-props-store';

export const defaultAllProps = {
  ...propertiesStore,
  ...dataPropertiesStore,
  ...layoutPropertiesStore,
  ...validationPropertiesStore,
  ...apiPropertiesStore,
};
import brace from 'brace';
import 'brace/mode/html';
import 'brace/mode/json';
import 'brace/theme/textmate';
import 'brace/keybinding/vim';

export class ControlProp {
  prop; // Property object from propertiesStore
  /* name */
  /* title */
  /* type */
  /* placeholder */
  /* required */
  /* options */
  /* value */
  editor; // Only for HTML type

  constructor(type, customPropsStore) {
    this.prop = customPropsStore !== undefined ? { ...customPropsStore[type] } : { ...defaultAllProps[type] };
    this.id = `cp-${this.prop.name}`;
  }

  renderProp() {
    const isBoolean = this.prop.type === 'boolean';
    const isHTML = this.prop.type === 'html';
    const children = [
      markup('label', this.prop.title, {
        for: this.id,
        class: [
          'align-content-end',
          [isBoolean ? '' : 'fw-medium', isHTML ? 'col-sm-12' : isBoolean ? 'col-sm-12' : 'col-sm-12 col-md-3'].join(
            ' ',
          ),
          isBoolean ? 'form-check-label' : 'form-label',
          this.prop.type === 'hidden' ? 'd-none' : '',
        ].join(' '),
      }),
      markup(
        'div',
        _renderProp(
          {
            id: this.id,
            type: this.prop.type,
            value: this.prop.value,
            name: this.prop.name,
            placeholder: this.prop.placeholder,
            structure: this.prop.structure,
            addEmptyOption: this.prop.addEmptyOption,
            className: this.prop.className,
          },
          this.prop.options,
          { required: this.prop.required, min: this.prop.min, max: this.prop.max },
        ),
        { class: isHTML ? 'col-sm-12' : 'col-sm-12 col-md-9' },
      ),
    ];
    if (this.prop.type === 'boolean') {
      children.reverse();
    }
    return markup('div', children, {
      class: [
        'mb-3 row',
        'control-prop',
        this.prop.type === 'boolean' ? 'form-check' : '',
        this.prop.addDivider ? 'border-bottom pb-3' : '',
      ].join(' '),
      style: this.prop.hide ? 'display: none;' : '',
    });
  }

  addChangeEvent(context, cb) {
    if (!cb) return;
    if (this.prop.type === 'boolean' || this.prop.type === 'checkbox') {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
    }
    if (this.prop.type === 'select-boxes') {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
    }

    if (this.prop.name === CONTROL_PROPS_TYPES.CUSTOM_CLASS || ['select', 'multi-select'].includes(this.prop.type)) {
      $(`#${this.id}`).on('change', { context, prop: this.prop }, cb);
      if (this.prop.type === 'multi-select') {
        $(`#${this.id}`).on('change', { context, prop: this.prop }, (event) => {
          const values = $(event.target).val() ?? [];
          $(`#${this.id}-values`).text(values.join(', '));
        });
      }
    } else if (['string', 'number', 'email', 'date', 'textarea', 'tel'].includes(this.prop.type)) {
      $(`#${this.id}`).on('input', { context, prop: this.prop }, cb);
    }
    if (['html', 'json'].includes(this.prop.type)) {
      const hiddenElementId = `#${this.id}-hidden`;
      const mode = this.prop.type === 'html' ? 'html' : 'json';
      this.editor = brace.edit(this.id);
      this.editor.setTheme('ace/theme/textmate');
      this.editor.getSession().setMode(`ace/mode/${mode}`);
      this.editor.setValue(this.prop.value);

      $(hiddenElementId).on('change', { context, prop: this.prop }, cb);
      $(`#${this.id} textarea`).on('keydown input paste', { editor: this.editor }, (event) => {
        if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift'].includes(event.key)) {
          return;
        }
        if (event.type != 'input' && event.key && !['Backspace', 'Delete'].includes(event.key)) {
          return;
        }
        const { editor } = event.data;
        const hiddenElementId = `#${this.id}-hidden`;
        const value = (editor.session.doc.$lines ?? []).join('\n');
        $(hiddenElementId).val(value).trigger('change');
      });
    }
  }
}

export function _renderProp(basicProps, options = [], validations = {}) {
  const { id, type, value, placeholder, className, dataKey, dataRowId } = basicProps;
  const inputType = type === 'boolean' ? 'checkbox' : type === 'string' ? 'text' : type;
  const { required, min, max } = validations;

  const generalProps = {
    id,

    'data-key': dataKey,
    'data-rowId': dataRowId,
    class: className,
  };
  if (required) generalProps.required = true;
  if (min) generalProps.min = min;
  if (max) generalProps.max = max;

  if (inputType === 'select' || inputType === 'multi-select') {
    let values = [];
    const showValues = inputType === 'multi-select';
    if (inputType === 'multi-select') {
      generalProps.multiple = true;
      values = !Array.isArray(value) ? value.split(',') : value;
    }

    const selectEl = markup('select', '', {
      ...generalProps,
      class: [className ?? '', 'form-select'].join(' '),
    });
    if (basicProps.addEmptyOption) {
      selectEl.appendChild(markup('option', '', { value: '' }));
    }
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const optionEl = document.createElement('option');
      for (const key in option) {
        optionEl[key] = option[key];
      }
      if (option['value'] === value || (values.length > 0 && values.includes(option['value']))) {
        optionEl.selected = true;
      }

      selectEl.appendChild(optionEl);
    }
    return showValues
      ? markup('div', [
          selectEl,
          markup('span', '', { class: 'text-muted mt-2', id: `${id}-values`, style: 'font-size: 12px;' }),
        ])
      : selectEl;
  }
  if (inputType === 'checkbox') {
    const checkboxProps = {
      ...generalProps,
      type: inputType,
      class: [className ?? '', 'form-check-input'].join(' '),
    };
    if (value) {
      checkboxProps.checked = value;
    }
    return markup('input', '', checkboxProps);
  }

  if (inputType === 'array') {
    return markup('h3', 'Invalid table data.');
  }

  if (inputType === 'textarea') {
    return markup('textarea', value, {
      ...generalProps,
      class: [className ?? '', 'form-control'].join(' '),
      rows: 3,
      placeholder,
    });
  }

  if (inputType === 'select-boxes') {
    const selectBoxes = [];
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const customProps = {
        type: 'checkbox',
        id: `id-${id}-${i}`,
        name: basicProps.name,
        value: opt.value,
        class: [className ?? '', 'form-check-input'].join(' '),
      };

      try {
        if (value.includes(opt.value) && value !== '') {
          customProps.checked = true;
        }
      } catch (error) {}

      selectBoxes.push(
        markup(
          'div',
          [
            markup('input', '', customProps),
            markup('label', opt.text, { for: customProps.id, class: 'form-check-label' }),
          ],
          { class: 'form-check' },
        ),
      );
    }

    return markup('div', selectBoxes, { id });
  }

  if (['html', 'json'].includes(inputType)) {
    const element = markup('div', value, {
      ...generalProps,
    });
    const hiddenEditor = markup('input', '', {
      value,
      type: 'hidden',
      id: `${id}-hidden`,
    });
    return markup('div', [element, hiddenEditor]);
  }

  if (inputType === 'hidden') {
    return markup('input', '', {
      ...generalProps,
      type: inputType,
    });
  }

  return markup('input', '', {
    ...generalProps,
    type: inputType,
    value,
    placeholder,
    class: [className ?? '', 'form-control'].join(' '),
  });
}
