import { CONTROL_VALIDATION_PROPS_TYPES } from '../../utils/control-props-types';
import { INPUT_TYPES } from '../../utils/input-types';
import { BaseValidationProps } from '../data-props/base-validation-props';

export class EditableGridValidationProps extends BaseValidationProps {
  constructor(props) {
    super(validationProps);
    this.fillInProps(props);
    this.modifyPropValue(CONTROL_VALIDATION_PROPS_TYPES.VALIDATE_ON, 'change');
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target
      ? e.target.type === INPUT_TYPES.CHECK_BOX
        ? e.target.checked
        : e.target.type === 'number'
        ? Number.parseInt(e.target.value) || 0
        : e.target.value
      : e.value;

    _this.modifyPropValue(prop.name, value);
    _this.editor._renderPreviewControl();
  }

  render() {
    return super.render();
  }
}

const validationProps = [CONTROL_VALIDATION_PROPS_TYPES.MIN_ITEMS, CONTROL_VALIDATION_PROPS_TYPES.MAX_ITEMS];
