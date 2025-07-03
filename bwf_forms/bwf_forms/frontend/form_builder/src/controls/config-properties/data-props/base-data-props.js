import { INPUT_TYPES } from '../../utils/input-types';
import { BaseControlProps } from '../base-control-props';

export class BaseDataProps extends BaseControlProps {
  $p;
  editor;

  constructor(props, customPropsStore) {
    super(props, customPropsStore);
  }

  renderInParent() {
    if (this.$p) {
      this.$p.empty();
      const rendered = this.render();
      this.$p.append(rendered);
    }
    super.addChangeEvents(this, this._onDataPropsChange);
  }

  setEditor(parentContainer, editor) {
    this.$p = parentContainer;
    this.editor = editor;
  }

  clearEditor() {
    this.$p = null;
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;
    _this.modifyPropValue(prop.name, value);
  }
}
