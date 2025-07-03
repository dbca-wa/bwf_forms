import { EditableDropableControl } from './editable-dropable-control';
import { DropableControl } from './dropable-control';

export class DropablesFactory {
  static getDropableControl(dropableType, props = {}, attr = {}) {
    if (dropableType === 'edit-dropable') {
      return new EditableDropableControl(attr, props);
    }
    return new DropableControl(attr, props);
  }
}
