import { Renderer } from './base-renderer';
import { format } from 'date-fns';
import { activateTooltips } from '../../js/control-utils';
import { instantiateJsonControl } from '../../js/fb-build-area';
import { GENERAL_DATE_FORMAT, MAX_NUM_ITEMS_EDITABLE_GRID } from '../utils/constants';
import {
  CONTROL_API_PROPS_TYPES,
  CONTROL_DATA_PROPS_TYPES,
  CONTROL_PROPS_TYPES,
  CONTROL_VALIDATION_PROPS_TYPES,
} from '../utils/control-props-types';
import { markup } from '../../js/utils';

import { ELEMENT_TYPES } from '../utils/element-types';

export class MultiControlRenderer extends Renderer {
  rowsData = [];
  constructor(control, controls, props = {}) {
    super(control, props);
    this.controls = controls;
    this.id = `renderer-${control.id}`;
  }

  getValues() {
    return this.rowsData.map((r) => r.values).filter((r) => r);
  }

  validateRows() {
    return this.rowsData.every((row) => !row.isEditing);
  }

  addRow(initialValues = {}) {
    const maxItems = this.props[CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS] || MAX_NUM_ITEMS_EDITABLE_GRID;
    if (this.rowsData.length >= maxItems) {
      return;
    }
    const index = $(`#${this.id} .rows .row`).length;
    const rowId = `row-${this.id}-${index}`;
    const rowEdition = markup('div', '', {
      class: 'row py-2 border-1 border-bottom justify-content-between',
      id: rowId,
    });

    const rowData = {
      id: rowId,
      controls: [],
      values: null,
      isEditing: true,
    };
    $(`#${this.id} .rows`).append(rowEdition);

    for (let i = 0; i < this.controls.length; i++) {
      const elm = instantiateJsonControl(this.controls[i].toJSON());
      const elmProps = elm.getPropsObject();
      const fieldName = elmProps[CONTROL_API_PROPS_TYPES.FIELD_NAME];
      if (fieldName && initialValues[fieldName]) {
        elm.setInitialValue(initialValues[fieldName]);
      }

      const col = markup('div', '', { class: 'col control' });
      rowEdition.append(col);
      this.renderControlEdition($(col), elm, elm?.getDefaultValue());

      rowData.controls.push(elm);
    }
    const col = markup('div', this.getButtons(rowId), { class: 'col-md-2 col-lg-2 actions' });
    this.rowsData.push(rowData);
    rowEdition.append(col);
    this.enableActionButtons(rowId);
    this.additionalEvents(rowId);
    $(rowEdition).find('input')?.first()?.trigger('focus');

    activateTooltips(rowEdition);
  }

  enableActionButtons(rowId) {
    $(`#${rowId} button.save-row`)?.on('click', this, this.saveRow);
    $(`#${rowId} button.cancel-row`)?.on('click', this, this.cancelRow);
    $(`#${rowId} .edit-row`)?.on('click', this, this.editRow);
    $(`#${rowId} .remove-row`)?.on('click', this, this.removeRow);
  }

  additionalEvents(rowId) {
    $(`#${rowId} input`)?.on('keydown', this, (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        $(`#${rowId} .actions .save-row`).trigger('click');
      }
    });
  }

  getButtons(rowId) {
    const buttonSave = markup('button', 'Save', {
      class: 'btn btn-primary save-row',
      'data-rowId': rowId,
      type: 'button',
    });
    const buttonCancel = markup('button', [{ tag: 'i', class: 'bi bi-x' }, ''], {
      class: 'btn btn-secondary cancel-row',
      'data-rowId': rowId,
      type: 'button',
    });

    const btnGroup = markup('div', [buttonSave, buttonCancel], {
      class: 'btn-group btn-group-sm',
      role: 'group',
      'aria-label': 'Actions',
    });

    const btnGroup2 = markup(
      'div',
      [
        markup('button', [{ tag: 'i', class: 'bi bi-three-dots' }, ''], {
          class: 'btn btn-outline-secondary  dropdown-toggle',
          'data-bs-toggle': 'dropdown',
          'aria-expanded': 'false',
        }),
        markup(
          'ul',
          [
            markup('li', markup('a', 'Edit', { class: 'dropdown-item edit-row', 'data-rowId': rowId, href: '#' })),
            markup(
              'li',
              markup('a', ['Remove'], {
                class: 'dropdown-item remove-row',
                'data-rowId': rowId,
                href: '#',
              }),
            ),
          ],
          { class: 'dropdown-menu' },
        ),
      ],
      { class: 'btn-group btn-group-sm edit-button-group', style: 'display: none' },
    );
    return [btnGroup, btnGroup2];
  }

  saveRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    const { controls } = row;
    let isValid = true;
    let i = 0;
    for (i = 0; i < controls.length; i++) {
      const control = controls[i];
      const controlValid = control.validateValue();
      isValid &= controlValid;
    }
    if (isValid) {
      for (i = 0; i < controls.length; i++) {
        const control = controls[i];
        if (typeof control.getFieldValue === 'function') {
          row.values = { ...row.values, ...control.getFieldValue() };
        }
        const container = $(`#${rowId} .control`)[i];
        _this.renderControlDisplay($(container), control);
      }
      row.isEditing = false;
      $(`#${rowId} .actions .edit-button-group`).show();
      $(`#${rowId} .actions .save-row, #${rowId} .actions .cancel-row`).hide();
    }
  }

  cancelRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    if (row && row.values) {
      const { controls } = row;
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        const props = control.getPropsObject();
        const container = $(`#${rowId} .control`)[i];
        _this.renderControlDisplay($(container), control, row.values[props[CONTROL_API_PROPS_TYPES.FIELD_NAME]]);
      }
      row.isEditing = false;
      $(`#${rowId} .actions .edit-button-group`).show();
      $(`#${rowId} .actions .save-row, #${rowId} .actions .cancel-row`).hide();
    } else {
      const index = _this.rowsData.indexOf(row);
      _this.rowsData.splice(index, 1);
      $(`#${rowId}`).remove();
    }
  }

  removeRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    const index = _this.rowsData.indexOf(row);
    _this.rowsData.splice(index, 1);
    $(`#${rowId}`).remove();
  }

  editRow(e) {
    e.preventDefault();
    const _this = e.data;
    const { rowId } = e.currentTarget.dataset;
    const row = _this.rowsData.find((r) => r.id === rowId);
    const { controls } = row;

    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      const props = control.getPropsObject();
      const container = $(`#${rowId} .control`)[i];
      const fieldName = props[CONTROL_API_PROPS_TYPES.FIELD_NAME];
      _this.renderControlEdition($(container), control, fieldName ? row.values[fieldName] : row.values);
    }
    row.isEditing = true;
    $(`#${rowId} .actions .save-row, #${rowId} .actions .cancel-row`).show();
    $(`#${rowId} .actions .edit-button-group`).hide();
  }

  renderControlEdition(container, control, value, isChild = false) {
    container.empty();
    const elmProps = control.getPropsObject();
    const renderProps = {
      ...elmProps,
      [CONTROL_PROPS_TYPES.CUSTOM_CLASS]: [elmProps[CONTROL_PROPS_TYPES.CUSTOM_CLASS] ?? '', 'py-2'].join(' '),
      [CONTROL_PROPS_TYPES.HIDE_LABEL]: !isChild,
      [CONTROL_PROPS_TYPES.HIDDEN]: false,
      [CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE]: value,
    };
    const hasChildren = control.children && control.children.length > 0;
    if (hasChildren) {
      const innerContainer = markup('div', '', {
        class: [isChild ? 'col' : 'row'].join(' '),
      });
      container.append(innerContainer);
      for (let i = 0; i < control.children.length; i++) {
        const elm = control.children[i];
        const fieldName = elm.getPropsObject()[CONTROL_API_PROPS_TYPES.FIELD_NAME];
        const val = isChild && elm.children ? value : fieldName ? value[fieldName] : value;
        const col = markup('div', '', { class: 'col' });
        innerContainer.append(col);
        this.renderControlEdition($(col), elm, val, true);
      }
      return;
    }

    if (control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
      renderProps.values = Array.isArray(value) ? value : [value];
    }
    const renderedElm = control.render(renderProps, { 'data-control-id': control.id });
    container.append(renderedElm);
    control.$p = container;
    control.afterRender();
  }

  renderControlDisplay(container, control, val = undefined, isChild = false) {
    const hasChildren = control.children && control.children.length > 0;
    const value = val != undefined ? val : control.getElementValue();
    if (hasChildren) {
      const innerContainer = markup('div', '', {
        class: [isChild ? 'col' : 'row'].join(' '),
      });
      container.empty();
      container.append(innerContainer);
      for (let i = 0; i < control.children.length; i++) {
        const elm = control.children[i];
        const elmProps = elm.getPropsObject();
        const col = markup('div', '', { class: 'col' });
        innerContainer.append(col);
        this.renderControlDisplay(
          $(col),
          elm,
          elm.children ? value : value[elmProps[CONTROL_API_PROPS_TYPES.FIELD_NAME]],
          true,
        );
      }

      return;
    }
    let controlDisplay = '';
    if (typeof value === 'boolean') {
      controlDisplay = markup('div', {
        tag: 'i',
        class: value ? 'bi bi-check fs-4 text-success' : 'text-muted',
        content: value ? '' : '-',
      });
    } else if (Array.isArray(value)) {
      if (control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
        controlDisplay = markup('div', value.map((v) => format(v, GENERAL_DATE_FORMAT)).join(' - '));
      } else {
        controlDisplay = markup('div', value.join(', '));
      }
    } else if (control.elementType === ELEMENT_TYPES.DATE_PICKER_JQ) {
      controlDisplay = markup('div', format(value, GENERAL_DATE_FORMAT));
    } else {
      controlDisplay = markup('div', `${value}`);
    }
    container.empty();
    if (isChild) {
      container.append(
        markup('span', control?.label ? `${control.label.text}: ` : '', { class: 'fw-medium' }),
        controlDisplay,
      );
    } else {
      container.append(controlDisplay);
    }
  }

  render() {
    const divContainer = markup('div', '', { class: 'r-multi-control', id: this.id });

    const header = markup('div', '', {
      class: 'row p-1 bg-dark bg-opacity-10 border border-3 border-start-0 border-end-0',
    });
    for (let i = 0; i < this.controls.length; i++) {
      const elm = this.controls[i];
      const elmProps = elm.getPropsObject();
      const fieldLabel = elmProps[CONTROL_PROPS_TYPES.HIDE_LABEL]
        ? ''
        : elmProps[CONTROL_PROPS_TYPES.LABEL] || elmProps[CONTROL_API_PROPS_TYPES.FIELD_NAME];
      const col = markup('div', fieldLabel, { class: 'col' });
      header.append(col);
    }
    header.append(markup('div', '', { class: 'col-md-2 col-lg-2' }));

    const rows = markup('div', '', { class: 'rows' });
    const buttonAdd = markup('button', [{ tag: 'i', class: 'bi bi-plus' }, 'Add record'], {
      class: 'btn btn-primary add-row mt-2',
      type: 'button',
    });

    if (this.controls.length > 0) {
      divContainer.append(header);
      divContainer.append(rows);
      divContainer.append(markup('div', buttonAdd, { class: 'd-grid gap-2 col-sm-12 col-md-3 col-lg-2' }));
    } else {
      divContainer.append(markup('div', 'No controls defined', { class: 'text-center text-muted py-3' }));
    }

    return divContainer;
  }

  afterRender() {
    $(`#${this.id} button.add-row`).on('click', () => this.addRow());

    const minItems = this.props[CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS] || 0;
    const defaultValue = this.props[CONTROL_DATA_PROPS_TYPES.DEFAULT_VALUE];
    if (defaultValue) {
      for (let i = 0; i < defaultValue.length; i++) {
        this.addRow(defaultValue[i]);
        $(`#${this.id} .rows`).last().find('.actions .save-row').trigger('click');
      }
    } else {
      for (let i = 0; i < minItems; i++) {
        this.addRow();
      }
    }
  }
}
