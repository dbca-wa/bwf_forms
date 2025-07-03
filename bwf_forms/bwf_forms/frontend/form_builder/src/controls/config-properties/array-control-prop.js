import { markup } from '../../js/utils';
import { DynamicTableControl } from './components-control-props/dynamic-table-control';
import { ControlProp } from './control-prop';

export class ArrayControlProp extends ControlProp {
  table;

  constructor(type, customPropsStore) {
    super(type, customPropsStore);
  }

  renderProp() {
    try {
      const { structure, sortable, hidden } = this.prop.props;
      if (hidden || this.prop.hide) return markup('div');

      this.table = new DynamicTableControl({ id: this.id }, { structure, values: this.prop.value, sortable, hidden });
    } catch (error) {
      console.error(error);
      return markup('h3', 'Invalid table data.');
    }

    const children = [
      markup('label', this.prop.title, {
        class: 'form-label fw-medium',
      }),
      this.table.render(),
    ];

    return markup('div', children, { class: ' mb-3' });
  }

  addChangeEvent(context, cb) {
    if (!cb || !this.table) return;

    this.table.addChangeEventHandler({
      fn: cb,
      context: { context, prop: this.prop },
    });
  }
}
