import { CONTROL_API_PROPS_TYPES } from '../../utils/control-props-types';
import { INPUT_TYPES } from '../../utils/input-types';

import { BaseAPIProps } from '../data-props/base-api-props';

const definition = [CONTROL_API_PROPS_TYPES.FIELD_NAME];

export class BasicAPIProps extends BaseAPIProps {
  constructor(elementType, props) {
    super(definition);
    this.fillInProps(props);
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;
    const pattern = prop.pattern;
    if (pattern) {
      if (!new RegExp(pattern).test(value)) {
        _this.editor.addError(prop.title, 'Invalid value');
      } else {
        _this.editor.removeError(prop.title);
      }
    }
    _this.modifyPropValue(prop.name, value);
    _this.editor._renderPreviewControl();
  }

  render() {
    return super.render();
  }
}
