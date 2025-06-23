import { markup } from '../../js/utils';
import { CONTROL_VALIDATION_PROPS_TYPES } from '../utils/control-props-types';
import { Renderer } from './base-renderer';

export class NumberArrowsRenderer extends Renderer {
  constructor(control, element, props = {}) {
    super(control, props);
    this.element = element;
    this.id = `renderer-${control.id}`;
    this.step = Number(props.step) || 1;
    this.validateOn = props[CONTROL_VALIDATION_PROPS_TYPES.VALIDATE_ON] || 'blur';
  }

  render() {
    const button1 = markup(
      'button',
      { tag: 'i', class: 'bi bi-chevron-down' },
      { class: 'btn btn-outline-secondary button-subtract', type: 'button' },
    );
    const button2 = markup(
      'button',
      { tag: 'i', class: 'bi bi-chevron-up' },
      { class: 'btn btn-outline-secondary button-add', type: 'button' },
    );
    const renderedControl = this.element;
    const divContainer = markup('div', [button1, renderedControl, button2], {
      class: 'r-number-arrows input-group',
      id: this.id,
    });

    return divContainer;
  }
  afterRender() {
    $(`#${this.id} button.button-add`).on('click', this, (event) => {
      const _this = event.data;
      const val = _this.control.getElementValue() || 0;
      $(_this.element)
        .val(val + _this.step)
        .trigger(_this.validateOn);
    });
    $(`#${this.id} button.button-subtract`).on('click', this, (event) => {
      const _this = event.data;
      const val = _this.control.getElementValue() || 0;
      $(_this.element)
        .val(val - _this.step)
        .trigger(_this.validateOn);
    });
  }
}
