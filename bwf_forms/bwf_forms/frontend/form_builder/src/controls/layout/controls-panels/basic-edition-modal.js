import { markup } from '../../../js/utils';

export default class BasicEditionModal {

  controlId = '';
  controlType = '';

  _control = null;

  constructor(id, controlType, params) {
    this.controlId = id;
    this.controlType = controlType;
    if (params) {
    }
  }

  addControl(control) {
    console.log('Control added');
  }

  render() {
    return markup('div', '', { id: this.controlId, class: 'edition-wrapper' });
  }
}
