let COUNTER = 0;

export default class Script {
  private _how_load: string = '';
  private _code: string = '';
  private _onload_func_name: string = '';
  private _onload_cb: null | string = null;

  static createOnloadName() {
    return '__onload_'+Math.floor(Date.now() + COUNTER++);
  }

  constructor(private _src: string) {}

  async() {
    this._how_load = ' async';
    return this;
  }

  defer() {
    this._how_load = ' defer';
    return this;
  }

  code(code: string) {
    this._code = code;
    return this;
  }


  onload(code: string) {
    // TODO: generate function name
    this._onload_func_name = Script.createOnloadName();
    this._onload_cb = `function ${this._onload_func_name}(){${code}}`;
    return this;
  }

  _if(val: string, template: string) {
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
