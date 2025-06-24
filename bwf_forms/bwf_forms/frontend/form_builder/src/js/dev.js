/* eslint-disable no-alert */
import $ from 'jquery';
window.jQuery = window.$ = require('jquery');
import '@popperjs/core/dist/umd/popper.min.js';
import '../scss/app.scss';
import 'jquery-ui/dist/jquery-ui.js';
import 'jquery-toast-plugin/dist/jquery.toast.min.js';
import 'jquery-mask-plugin/dist/jquery.mask.js';
/* Your JS Code goes here */
import './form-builder.js';

$(() => {
  if ($.fn.formBuilder) {
    // console.log('BWF Forms - Form Builder');
  }
});
