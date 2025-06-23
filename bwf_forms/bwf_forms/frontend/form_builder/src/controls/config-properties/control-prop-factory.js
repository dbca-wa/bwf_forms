import { ArrayControlProp } from './array-control-prop';
import { DynamicDateControl } from './components-control-props/dynamic-date-control';
import { ControlProp, defaultAllProps } from './control-prop';
import { CustomControlProp } from './custom-control-prop';

export class ControlPropFactory {
  static createControlProp(type, customPropsStore) {
    const prop = customPropsStore !== undefined ? { ...customPropsStore[type] } : { ...defaultAllProps[type] };
    if (prop.type === 'array') {
      return new ArrayControlProp(type, customPropsStore);
    }
    if (prop.type === 'relative-date') {
      return new CustomControlProp(type, customPropsStore, DynamicDateControl);
    }

    return new ControlProp(type, customPropsStore);
  }
}
