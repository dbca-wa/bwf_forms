/**
 * Generate a random id of up to 10 characters
 * @return {string} random id
 */
export const generateRandomId = () => {
  return Math.random().toString(36).slice(2, 10);
};

/**
 * recursively flatten a nested array
 * @param {Array} arr to be flattened
 * @return {Array} flattened array
 */
export const flattenArray = (arr) =>
  arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flattenArray(val) : val), []);

/**
 * Convert strings into lowercase-hyphen
 *
 * @param  {string} str
 * @return {string}
 */
export const hyphenCase = (str) => {
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/[^\w\s\-]/gi, '');
  str = str.replace(/([A-Z])/g, function ($1) {
    return '-' + $1.toLowerCase();
  });

  return str.replace(/\s/g, '-').replace(/^-+/g, '');
};
export const safeAttrName = (name) => {
  const safeAttr = {
    className: 'class',
  };

  return safeAttr[name] || hyphenCase(name);
};

export const camelCase = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const compareMinMaxIntegers = (min, max) => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) return false;
  return min > max;
};

export const isPotentiallyDangerousAttribute = (attrName, attrValue) => {
  if (sanitizerConfig.backendOrder.length === 0) {
    //All backends disabled so no sanitization checks to be performed
    return false;
  }
  const attrNameLc = attrName.toLowerCase();
  attrValue = attrValue ? attrValue + '' : '';
  return (
    attrNameLc.startsWith('on') ||
    ['form', 'formaction'].includes(attrNameLc) ||
    attrValue.trim().toLowerCase().startsWith('javascript:')
  );
};

export const setElementContent = (element, content, asText = false) => {
  if (asText) {
    element.textContent = content;
  } else {
    element.innerHTML = content;

    return element;
  }
};

/**
 * Determine content type
 * @param  {Node | String | Array | Object} content
 * @return {string}
 */
export const getContentType = (content) => {
  if (content === undefined) {
    return content;
  }

  return [
    ['array', (content) => Array.isArray(content)],
    ['node', (content) => content instanceof window.Node || content instanceof window.HTMLElement],
    ['component', () => content && content.dom],
    [typeof content, () => true],
  ].find((typeCondition) => typeCondition[1](content))[0];
};

/**
 * Bind events to an element
 * @param  {EventTarget} element DOM element
 * @param  {Object} events  object full of events eg. {click: evt => callback}
 * @return {void}
 */
export const bindEvents = (element, events) => {
  if (events) {
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        const eventObjType = getContentType(events[event]);
        if (eventObjType === 'function') {
          element.addEventListener(event, (evt) => events[event](evt));
        } else if (eventObjType === 'object') {
          const { fn, ...options } = events[event];
          $(element).on(event, options, fn);
        }
      }
    }
  }
};

/**
 * Generate markup wrapper where needed
 *
 * @param  {string} tag Tag name
 * @param  {string|Array|object|Node|Function|null} content content to wrap
 * @param  {Object} attributes attributes to assign to element
 * @return {HTMLElement} DOM Element
 */
export const markup = function (tag, content = '', attributes = {}) {
  let contentType = getContentType(content);
  const { events, ...attrs } = attributes;
  const field = document.createElement(tag);

  const appendContent = {
    string: (content) => {
      setElementContent(field, field.innerHTML + content);
    },
    number: (content) => {
      setElementContent(field, field.innerHTML + content);
    },
    object: (config) => {
      const { tag, content, ...data } = config;
      return field.appendChild(markup(tag, content, data));
    },
    node: (content) => {
      return field.appendChild(content);
    },
    array: (content) => {
      for (let i = 0; i < content.length; i++) {
        contentType = getContentType(content[i]);
        appendContent[contentType](content[i]);
      }
    },
    function: (content) => {
      content = content();
      contentType = getContentType(content);
      appendContent[contentType](content);
    },
    undefined: () => {},
  };

  for (const attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      const name = safeAttrName(attr);
      let attrVal = Array.isArray(attrs[attr]) ? unique(attrs[attr].join(' ').split(' ')).join(' ') : attrs[attr];

      if (typeof attrVal === 'boolean') {
        if (attrVal === true) {
          const val = name === 'contenteditable' ? true : name;
          field.setAttribute(name, val);
        }
      } else {
        /* if (name === 'id' || name === 'name') {
          attrVal = sanitizeNamedAttribute(attrVal);
        } */
        if (attrVal !== undefined) {
          field.setAttribute(name, attrVal);
        }
      }
    }
  }

  if (content) {
    appendContent[contentType](content);
  }

  bindEvents(field, events);

  return field;
};

export const unique = (array) => {
  return array.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
};

/**
 * Convert a number of bytes into a human-readable file size string
 * @param {number} bytes - The number of bytes
 * @return {string} - The human-readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Convert a human-readable file size string into bytes
 * @param {string} sizeStr - The file size string (e.g., '1GB', '1gb')
 * @return {number} - The number of bytes
 */
export const parseFileSize = (sizeStr) => {
  const units = ['bytes', 'kb', 'mb', 'gb', 'tb'];
  const regex = /^(\d+(?:\.\d+)?)\s*(bytes|kb|mb|gb|tb)$/i;
  const match = sizeStr.match(regex);

  if (!match) {
    return undefined;
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const exponent = units.indexOf(unit);

  return value * Math.pow(1024, exponent);
};

export const splitAPIFieldName = (fieldName) => {
  const regex = /(\D+)(\d*)$/;
  const match = fieldName.match(regex);
  if (!match) {
    return { field: fieldName, n: 0 };
  }
  const n = match[2] ? parseInt(match[2]) : 0;
  const index = fieldName.lastIndexOf(match[2]);

  return { field: fieldName.substring(0, index), n };
};

export const DataURIToBlob = (dataURI) => {
  const splitDataURI = dataURI.split(',');
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
};
