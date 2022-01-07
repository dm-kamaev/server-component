'use strict';


module.exports = class Link {
  constructor(href) {
    this._href = href;
  }

  charset(charset) {
    this._charset = charset;
    return this;
  }

  media(media) {
    this._media = media;
    return this;
  }

  rel(rel) {
    this._rel = rel;
    return this;
  }

  sizes(sizes) {
    this._sizes = sizes;
    return this;
  }

  type(type) {
    this._type = type;
    return this;
  }

  _if(val, template) {
    return val ? template : '';
  }

  toString() {
    // eslint-disable-next-line max-len
    return `<link${this._if(this._charset, ` charset="${this._charset}"`)}${this._if(this._rel, ` rel="${this._rel}"`)}${this._if(this._media, ` media="${this._media}"`)}${this._if(this._sizes, ` sizes="${this._sizes}"`)}${this._if(this._type, ` type="${this._type}"`)} href="${this._href}"/>`;
  }
};


// console.log(new module.exports('https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp').rel('stylesheet')+'');