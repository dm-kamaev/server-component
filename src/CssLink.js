'use strict';

const Link = require('./Link');

module.exports = class CssLink {
  constructor(href) {
    this._link = new Link(href).rel('stylesheet').type('text/css');
  }

  toString() {
    return this._link.toString();
  }
};
