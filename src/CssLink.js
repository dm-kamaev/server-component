'use strict';

const Link = require('./Link');

module.exports = class CssLink extends Link {
  constructor(href) {
    super(href);
    this.rel('stylesheet').type('text/css');
  }
};
