'use strict';

const GenCssIdentifier = require('@ignis-web/gen-css-identifier');

const genClassName = new GenCssIdentifier('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').except(['ga']);
const genId = new GenCssIdentifier('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').except(['ga']);

module.exports = {
  forClass() {
    return genClassName;
  },
  forId() {
    return genId;
  }
};