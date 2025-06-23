import { markup } from '../../js/utils';
import { ControlProp } from './control-prop';

export class CustomControlProp extends ControlProp {
  customClass;
  control;
  config;
  constructor(type, customPropsStore, customClass, config = {}) {
    super(type, customPropsStore);
    if (!customClass) throw new Error('Custom class is required for custom control prop.');
    this.customClass = customClass;
    this.config = config;
  }

  renderProp() {
    try {
      this.control = new this.customClass({ id: this.id, ...this.prop });
    } catch (error) {
      console.error(error);
      return markup('h3', 'Invalid Custom Control Data.');
    }

    const children = [
      markup('label', this.prop.title, {
        class: 'form-label fw-medium',
      }),
      this.control.render(),
    ];

    return markup('div', children, {
      class: ['mb-3', this.prop.addDivider ? 'border-bottom pb-3' : ''].join(' '),
      style: this.prop.hide ? 'display: none;' : '',
    });
  }

  addChangeEvent(context, cb) {
    if (!cb) return;

    this.control.addChangeEventHandler({
      fn: cb,
      context: { context, prop: this.prop },
    });
  }
}
