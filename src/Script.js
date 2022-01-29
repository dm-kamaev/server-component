'use strict';

let COUNTER = 0;

module.exports = class Script {

  static createOnloadName() {
    return '__onload_'+Math.floor(Date.now() + COUNTER++);
  }

  constructor(src) {
    this._src = src;
    this._how_load = '';
    this._code = '';

    this._onload_func_name = '';
    this._onload_cb = null;
  }

  async() {
    this._how_load = ' async';
    return this;
  }

  defer() {
    this._how_load = ' defer';
    return this;
  }

  code(code) {
    this._code = code;
    return this;
  }


  onload(code) {
    // TODO: generate function name
    this._onload_func_name = Script.createOnloadName();
    this._onload_cb = `function ${this._onload_func_name}(){${code}}`;
    return this;
  }

  _if(val, template) {
    return val ? template : '';
  }

  toString() {
    let res = '';
    if (this._onload_func_name) {
      res += `<script>${this._onload_cb}</script>`;
    }
    res += `<script${this._if(this._src, ` src="${this._src}"`)}${this._how_load}${this._if(this._onload_func_name,` onload="${this._onload_func_name}();"`)}>${this._code}</script>`;

    return res;
  }
};
