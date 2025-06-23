import baseModalTemplate from '../views/control-edition/base-modal.handlebars';
import baseModalBodyEdition from '../views/control-edition/base-modal-edition.handlebars';

import { markup } from './utils';
import { appSelectors } from './selectors';

import { ELEMENT_TYPES } from '../controls/utils/element-types';
import { CLASS_DROPABLE_BLOCKS } from '../controls/utils/constants';
import { BuildArea, instantiateJsonControl } from './fb-build-area';

import Tab from 'bootstrap/js/dist/tab.js';
import builderTemplate from '../views/builder/container.handlebars';
import { ELEMENT_CATEGORIES } from '../controls/utils/element-categories';
import { LAYOUT_TYPES } from '../controls/utils/layout-types';

const formAreaSel = 'formarea';

const controlsSel = 'formcomponents';
const formBuilderSel = 'formbuilder';
const formViewerSel = 'formviewer';

const MODES = {
  EDIT: 'edit',
  PREVIEW: 'preview',
};

export default class LayoutController {
  formControls = [];
  constructor(formBuilder, formControls) {
    this.b = formBuilder.$builder; // HTML
    this.formControls = formControls;
    BuildArea.getInstance().setBuilder(formBuilder);
    this.buildArea = BuildArea.getInstance();
    this.controlsPanel = undefined;
    this.mode = MODES.EDIT;
  }

  initialBuilderLayout() {
    this.b.empty();
    this.b.append(builderTemplate({}));

    this.toggleMode(MODES.EDIT);

    this.addMenuButtonsEvents();
    this.insertModals();
  }

  loadFormControls(parent) {
    Object.keys(this.formControls).forEach((category) => {
      const { name, label, icon } = ELEMENT_CATEGORIES[category];
      const collapseId = `category-${name}-collapse`;
      const categoryElement = markup('a', label, {
        class: 'category-group ',
        'data-bs-toggle': 'collapse',
        href: `#${collapseId}`,
        role: 'button',
        'aria-expanded': 'false',
        'aria-controls': `${collapseId}`,
      });

      parent.append(categoryElement);
      const catContainer = markup('div', '', {
        class: ['category-container collapse', 'show'].join(' '),
        id: collapseId,
      });
      parent.append(catContainer);
      this.formControls[name].forEach((control) => {
        if (!control.label) return;
        const controlElement = markup(
          'div',
          [markup('i', '', { class: control.icon }), markup('span', control.label)],
          {
            class: 'control draggable-control ',
            'data-controlType': control.type,
            'data-label': control.label,
            'data-icon': control.icon,
          },
        );

        catContainer.append(controlElement);
      });
    });
  }

  renderFormBuilder(initialJson = []) {
    this.initialBuilderLayout();
    this.buildArea.clearAreaContainer();

    initialJson.forEach((control) => {
      try {
        const element = instantiateJsonControl(control);

        this.buildArea.area.addControl(this.buildArea.area.$c, element);
      } catch (error) {
        console.error(error);
      }
    });
    this.buildArea.area.toggleEmptyDropableControl();
  }

  addMenuButtonsEvents() {
    $('#btn-mode').on('click', this, function (event) {
      const layout = event.data;
      layout.toggleMode();
    });
    $('#btn-save-form').on('click', this, function (event) {
      const layout = event.data;
      const formJson = layout.buildArea.toJSON();
      console.log('Saving form', formJson);
      window.localStorage.setItem('storedForm', JSON.stringify(formJson));
    });
    $('#btn-print-form').on('click', this, function (event) {
      const layout = event.data;
      const formJson = layout.buildArea.toJSON();
      console.log('The form', formJson);
    });
    $('#btn-load-form').on('click', this, function (event) {
      const layout = event.data;
      const storedForm = window.localStorage.getItem('storedForm');
      if (!storedForm) return;
      layout.renderFormBuilder(JSON.parse(storedForm));
    });
    $('#btn-new-form').on('click', this, function (event) {
      window.localStorage.removeItem('storedForm');
    });
    $('#btn-load-default').on('click', this, function (event) {
      const layout = event.data;
      const defaultElements = [
        // LAYOUT_TYPES.HTML_CONTENT,
        // ELEMENT_TYPES.FILE_UPLOAD,
        // LAYOUT_TYPES.ROW_COLUMNS,
        LAYOUT_TYPES.EDIT_GRID,
        // ELEMENT_TYPES.INPUT_NUMBER,
        // ELEMENT_TYPES.INPUT,
        // ELEMENT_TYPES.SELECT,
        // ELEMENT_TYPES.CHECK_BOX,
        // ELEMENT_TYPES.RADIO,
        // ELEMENT_TYPES.BUTTON,
      ];

      layout.buildArea.clearAreaContainer();
      layout.renderFormBuilder(defaultElements.map((el) => ({ elementType: el })));
    });
  }

  toggleMode(mode) {
    this.mode = mode ? mode : this.mode === MODES.EDIT ? MODES.PREVIEW : MODES.EDIT;
    if (this.mode === MODES.EDIT) {
      $('#btn-mode')
        .empty()
        .append(' Preview &nbsp;', markup('i', '', { class: 'bi bi-eye' }));
      this.enableEditMode();
    } else {
      $('#btn-mode')
        .empty()
        .append(' Edit &nbsp;', markup('i', '', { class: 'bi bi-pencil' }));
      this.enableViewMode();
    }
  }

  enableEditMode() {
    $(`#${formViewerSel}`)
      .empty()
      .append(markup('form', '', { class: 'needs-validation', novalidate: '' }));

    $(`#${formBuilderSel}`).addClass(formBuilderSel);
    $(`#${formBuilderSel}`).append(markup('div', '', { id: controlsSel, class: 'formcomponents col-sm-2' }));
    $(`#${formBuilderSel}`).append(
      markup('div', '', {
        id: formAreaSel,
        class: 'col-sm-8 formarea fb-dropable-blocks',
        'data-content': 'Drag a field from the right to this area',
      }),
    );

    this.buildArea.setAreaContainer($(`#${formAreaSel}`));
    this.controlsPanel = $(`#${controlsSel}`);

    // $(`.${formAreaSel}`).disableSelection();

    this.loadFormControls(this.controlsPanel);
    $(`.${controlsSel} .category-container`).sortable({
      helper: (e, sender) => {
        const { label, icon } = sender[0].dataset;
        return markup('div', [markup('i', '', { class: icon }), markup('span', `&nbsp;${label}`)], {
          class: 'btn btn-primary',
        });
      },
      cursor: 'move',
      scroll: false,
      revert: true,
      revertDuration: 3000,
      tolerance: 'pointer',
      placeholder: 'ui-state-highlight',
      connectWith: `.${CLASS_DROPABLE_BLOCKS}`,
    });
    $(`.${controlsSel} .category-container`).on('sortupdate', (sender, ui) => {
      return;
    });
    $(`.${controlsSel}`).disableSelection();
  }

  enableViewMode() {
    $(`#${formBuilderSel}`).empty();
    $(`#${formBuilderSel}`).attr('class', '');

    $(`#${controlsSel}`).empty();
    this.buildArea.viewForm($(`#${formViewerSel} form`));
  }

  insertModals() {
    const idSelector = appSelectors.modalControlEdition;
    this.b.append(
      baseModalTemplate({
        id: idSelector,
      }),
    );
    const $m = $(`#${idSelector}`);
    $m.find('.modal-body').append(baseModalBodyEdition({ title: 'Test Modal' }));
    $m.find('.modal-dialog').addClass('modal-xl');
    const triggerTabList = document.querySelectorAll('#tabsEdition button');
    triggerTabList.forEach((triggerEl) => {
      const tabTrigger = new Tab(triggerEl);

      triggerEl.addEventListener('click', (event) => {
        event.preventDefault();
        tabTrigger.show();
      });
    });
    // Modal for Control Delete
    const idDeleteControlModal = appSelectors.modalControlDelete;
    this.b.append(
      baseModalTemplate({
        id: idDeleteControlModal,
      }),
    );
  }
}
