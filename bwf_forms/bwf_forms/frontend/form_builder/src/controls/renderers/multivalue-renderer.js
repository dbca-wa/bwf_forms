import { markup } from '../../js/utils';
import { Renderer } from './base-renderer';

export class MultivalueRenderer extends Renderer {
  constructor(control, element, props = {}) {
    super(control, props);
    this.element = element;
    this.id = `renderer-${control.id}`;
  }

  addRow() {
    const row = markup('div', '', { class: 'd-flex p-1' });

    const buttonRemove = markup(
      'button',
      { tag: 'i', class: 'bi bi-trash ' },
      { class: 'btn btn-danger flex-shrink-1 ms-3' },
    );
    const clone = this.element.cloneNode(true);
    clone.setAttribute('id', `c-${this.control.id}`);
    clone.setAttribute('data-control-id', this.control.id);
    clone.classList.add(['w-80', 'py-2']);
    row.append(clone);
    row.append(buttonRemove);
    $(`#${this.id} .values`).append(row);
    $(row)
      .find('button')
      .on('click', (e) => {
        $(e.currentTarget).parent().remove();
      });
  }

  render() {
    const divContainer = markup('div', '', { class: 'r-multi-value', id: this.id });
    const values = markup('div', '', { class: 'values' });
    const buttonAdd = markup('button', 'Add', { class: 'btn btn-primary add-row mt-2', type: 'button' });
    values.append(this.element);
    divContainer.append(values);
    divContainer.append(buttonAdd);
    return divContainer;
  }
  afterRender() {
    $(`#${this.id} button.add-row`).on('click', () => this.addRow());
  }
}
