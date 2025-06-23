/* eslint-disable prefer-spread */

import LayoutController from './layout';

import { FORM_CONTROLS } from '../controls/toolbox';
import ViewerLayoutController from './viewer-layout';

/* eslint-disable no-plusplus */
class FormBuilder {
  constructor(element, settings, $) {
    console.log('FormBuilder initialized', {
      element,
      settings,
    });
    var _ = this;

    _.defaults = {
      name: 'DBCA-FORMBUILDER',
      theme: 'default',
      formControls: FORM_CONTROLS,
    };

    _.initials = {
      present: true,
      formData: settings.formData || [],
      submissionData: settings.submissionData || {},
      onSuccess: settings.onSuccess || undefined,
      onError: settings.onError || undefined,
    };
    $.extend(_, _.initials);

    _.$builder = $(element);

    _.body = [];

    _.$controlFactory = undefined;
    _.options = $.extend({}, _.defaults, settings);
    _.API_KEY = _.options.API_KEY || '';
    _.initialValue = _.options.initialValue || {};
    _.onSubmit = _.options.onSubmit || undefined;

    _.layout = new LayoutController(this, FORM_CONTROLS);

    _.originalSettings = _.options;
  }

  build() {
    const _ = this;
    _.layout.renderFormBuilder();
    _.$builder.find('#btn-load-form').trigger('click');
  }

  render(options = {}) {
    const fb = this;
    this.viewer = new ViewerLayoutController(fb);

    const mergedOptions = $.extend({}, fb.initials, options);
    const formData = mergedOptions.formData || [];
    const { onSuccess, onError, onSubmit, submissionData, initialValue } = mergedOptions;

    fb.viewer.renderForm(formData, { initialValue: initialValue || {} });

    const form = fb.viewer.form;
    form.on('submit', { viewer: fb.viewer, fb: fb }, (e) => {
      const { viewer } = e.data;
      const formData = viewer.getFormData();
      if (onSubmit) {
        onSubmit(formData);
      } else if (submissionData) {
        viewer.form.find("button[type='submit']").attr('disabled', 'disabled');
        const { url, method, data: preData, headers } = submissionData || {};
        fetch(url, {
          method: method ?? 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({ form_data: {...Object.fromEntries(formData)}, ...preData }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
            viewer.form.find("button[type='submit']").removeAttr('disabled');
            onSuccess && onSuccess(data);
            viewer.buildArea.clearAreaContainer();
            viewer.buildArea.viewForm(form);
          })
          .catch((error) => {
            viewer.form.find("button[type='submit']").removeAttr('disabled');
            onError && onError(error);
            console.error('Error:', error);
          });
      }
    });
  }

  onSubmit() {}

  getJSON() {
    return this.layout.buildArea.toJSON();
  }

  widget() {
    return this;
  }
}

jQuery.fn.formBuilder = function (...args) {
  const _ = this;
  const opt = args[0];
  const moreArgs = Array.prototype.slice.call(args, 1);
  const l = _.length;
  let i;
  let ret;

  for (i = 0; i < l; i++) {
    if (typeof opt === 'object' || typeof opt === 'undefined') {
      _[i].formb = new FormBuilder(_[i], opt, jQuery);
    } else {
      ret = _[i].formb[opt].apply(_[i].formb, moreArgs, jQuery);
    }
    if (typeof ret !== 'undefined') return ret;
  }
  return _;
};
