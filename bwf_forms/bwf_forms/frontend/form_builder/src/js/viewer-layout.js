import { DataURIToBlob, markup } from './utils';
import { BuildArea, instantiateJsonControl } from './fb-build-area';

const formViewerSel = 'formviewer';

export default class ViewerLayoutController {
  form;

  constructor(formBuilder) {
    this.b = formBuilder.$builder; // HTML
    BuildArea.getInstance().setBuilder(formBuilder);
    this.buildArea = BuildArea.getInstance();
  }

  initialViewerLayout() {
    this.b.empty();
    this.b.append(markup('div', '', { id: formViewerSel }));
    $(`#${formViewerSel}`)
      .empty()
      .append(markup('form', '', { class: 'needs-validation', novalidate: '' }));
    this.form = $(`#${formViewerSel} form`);

    this.buildArea.area.children.splice();
    this.insertModals();
  }

  renderForm(initialJson = [], options = {}) {
    const { initialValue } = options;
    this.initialViewerLayout();
    this.buildArea.clearAreaContainer();

    initialJson.forEach((control) => {
      try {
        const element = instantiateJsonControl(control);

        this.buildArea.area.children.push(element);
      } catch (error) {
        console.error(error);
      }
    });
    this.buildArea.area.setInitialValue(initialValue);
    this.buildArea.viewForm(this.form);
  }

  renderFormSubmitted() {
    this.initialViewerLayout();
    this.buildArea.clearAreaContainer();
    this.form.append(
      markup(
        'div',
        [
          'Form submitted successfully!',
          markup('button', '', {
            class: 'btn-close',
            'data-bs-dismiss': 'alert',
            'aria-label': 'Close',
            type: 'button',
          }),
        ],
        { class: 'alert alert-success  alert-dismissible fade show', role: 'alert' },
      ),
    );
  }

  getFormData() {
    const formData = new FormData();
    const data = this.buildArea.area.getFieldValue();
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (Array.isArray(value) && value.length > 0 && value[0].hasOwnProperty('base64')) {
        value.forEach((file, index) => {
          formData.append(`${key}[${index}]`, DataURIToBlob(file.base64));
        });
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }

  insertModals() {}
}
