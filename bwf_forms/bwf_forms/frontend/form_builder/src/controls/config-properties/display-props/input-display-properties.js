import { CONTROL_PROPS_TYPES } from '../../utils/control-props-types';
import { INPUT_TYPES } from '../../utils/input-types';
import { ELEMENT_TYPES } from '../../utils/element-types';
import { BaseDisplayProps } from '../data-props/base-display-props';

export class TextFieldDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(textProps);
    this.fillInProps(props);
  }

  render() {
    return super.render();
  }
}

export class InputFieldDisplayProps extends BaseDisplayProps {
  constructor(type = 'text', props) {
    super(getProps(type));
    this.fillInProps(props);
    if (type === INPUT_TYPES.CHECK_BOX) {
      this.modifyProp(CONTROL_PROPS_TYPES.LABEL_POSITION, {
        value: 'right',
        options: [
          { value: 'left', text: 'Left' },
          { value: 'right', text: 'Right' },
        ],
      });
    }
    if (type === INPUT_TYPES.NUMBER) {
      this.modifyPropVisibility(CONTROL_PROPS_TYPES.STEP, !this.props[CONTROL_PROPS_TYPES.SIDE_BUTTONS].prop.value);
    }
  }

  _onDataPropsChange(e) {
    const { context: _this, prop } = e.data;
    const value = e.target ? (e.target.type === INPUT_TYPES.CHECK_BOX ? e.target.checked : e.target.value) : e.value;

    _this.modifyPropValue(prop.name, value);
    _this.editor._renderPreviewControl();
    if (prop.name === CONTROL_PROPS_TYPES.SIDE_BUTTONS) {
      _this.modifyPropVisibility(CONTROL_PROPS_TYPES.STEP, !value);
      _this.renderInParent();
    }
  }
}

export class RadioDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(radioProps);
    this.fillInProps(props);
  }
}

export class CheckboxDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(checkboxProps);
    this.fillInProps(props);
  }
}

export class SelectDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(selectProps);
    this.fillInProps(props);
  }
}

export class ButtonDisplayProps extends BaseDisplayProps {
  constructor(props) {
    super(buttonProps);
    this.fillInProps(props);
  }
}

const textProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.SIZE,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.DISPLAY_MASK,
  //   CONTROL_PROPS_TYPES.PREFIX,
  //   CONTROL_PROPS_TYPES.SUFFIX,
  CONTROL_PROPS_TYPES.HIDDEN,
  CONTROL_PROPS_TYPES.DISABLED,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];
const passwordProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.SIZE,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];

const numberProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.SIZE,
  CONTROL_PROPS_TYPES.SIDE_BUTTONS,
  CONTROL_PROPS_TYPES.STEP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];

const textAreaProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.TEXTAREA_ROWS,
  //   CONTROL_PROPS_TYPES.PREFIX,
  //   CONTROL_PROPS_TYPES.SUFFIX,
  CONTROL_PROPS_TYPES.HIDDEN,
  CONTROL_PROPS_TYPES.DISABLED,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];

const radioProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.DISABLED,
];

const buttonProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.ACTION,
  CONTROL_PROPS_TYPES.SAVE_ON_ENTER,
  CONTROL_PROPS_TYPES.THEME,
  CONTROL_PROPS_TYPES.SIZE,
  CONTROL_PROPS_TYPES.BLOCK_BUTTON,
  CONTROL_PROPS_TYPES.LEFT_ICON,
  CONTROL_PROPS_TYPES.RIGHT_ICON,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.DISABLED,
];

const checkboxProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.DISABLED,
];

const selectProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.SIZE,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.HIDDEN,
  CONTROL_PROPS_TYPES.DISABLED,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];

const dateProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.PLACEHOLDER,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.SIZE,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.HIDDEN,
  CONTROL_PROPS_TYPES.DISABLED,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
];

const fileProps = [
  CONTROL_PROPS_TYPES.LABEL,
  CONTROL_PROPS_TYPES.LABEL_POSITION,
  CONTROL_PROPS_TYPES.DESCRIPTION,
  CONTROL_PROPS_TYPES.TOOLTIP,
  CONTROL_PROPS_TYPES.CUSTOM_CLASS,
  CONTROL_PROPS_TYPES.HIDE_LABEL,
  CONTROL_PROPS_TYPES.DISABLED,
];

function getProps(type) {
  switch (type) {
    case INPUT_TYPES.RADIO:
      return radioProps;
    case INPUT_TYPES.CHECK_BOX:
      return checkboxProps;
    case ELEMENT_TYPES.SELECT_BOXES:
      return checkboxProps;
    case INPUT_TYPES.DATE:
      return dateProps;
    case INPUT_TYPES.TEXT_AREA:
      return textAreaProps;
    case INPUT_TYPES.PASSWORD:
      return passwordProps;
    case INPUT_TYPES.NUMBER:
      return numberProps;
    case INPUT_TYPES.FILE_UPLOAD:
      return fileProps;
    default:
      return textProps;
  }
}
