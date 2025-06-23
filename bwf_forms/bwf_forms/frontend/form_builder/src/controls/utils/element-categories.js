export const ELEMENT_CATEGORIES_TYPES = {
  ELEMENT: 'element',
  MULTIPLE_CHOICE: 'elem-multiple-choice',
  LAYOUT: 'layout',
  DATA: 'data',
};
export const ELEMENT_CATEGORIES = {
  [ELEMENT_CATEGORIES_TYPES.ELEMENT]: {
    name: ELEMENT_CATEGORIES_TYPES.ELEMENT,
    label: 'Input Elements',
    icon: 'bi bi-type',
  },
  [ELEMENT_CATEGORIES_TYPES.MULTIPLE_CHOICE]: {
    name: ELEMENT_CATEGORIES_TYPES.MULTIPLE_CHOICE,
    label: 'Multiple Choice',
    icon: 'bi bi-check-square',
  },
  [ELEMENT_CATEGORIES_TYPES.LAYOUT]: {
    name: ELEMENT_CATEGORIES_TYPES.LAYOUT,
    label: 'Layout',
    icon: 'bi bi-layout-three-columns',
  },
  [ELEMENT_CATEGORIES_TYPES.DATA]: {
    name: ELEMENT_CATEGORIES_TYPES.DATA,
    label: 'Data',
    icon: 'bi bi-database',
  },
};
