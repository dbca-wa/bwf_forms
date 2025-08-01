import { INPUT_TYPES } from '../../utils/input-types';
import { BaseControlProps } from '../base-control-props';

export class BaseAPIProps extends BaseControlProps {
  $p;
  editor;

  constructor(props) {
    super(props);
  }

  renderInParent() {
    if (this.$p) {
      this.$p.empty().append(this.render());
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
