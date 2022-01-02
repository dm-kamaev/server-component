'use strict';


module.exports = class CssLink {
  constructor(href) {
    this._href = href;
  }

  toString() {
    return `<link rel="stylesheet" href="${this._href}"/>`;
  }
};
