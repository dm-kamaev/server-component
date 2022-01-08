'use strict';

const crypto = require('crypto');

const tpl = require('@ignis-web/tpl');

const CssClass = require('./CssClass');
const CssLink = require('./CssLink');
const Link = require('./Link');
const Script = require('./Script');

const format = require('./format');

const GeneratorClassName = require('./GeneratorClassName');
const generatoClassName = new GeneratorClassName('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

module.exports = class IgnisComp {

  constructor(data) {
    this._data = data;
    this._css = [];
    this._order_css = 0;

    this._js = { head: [() => this.headJs()], js: [() => this.js()] };

    this._shared_data = {};

    const stack = _getCallerFile();
    this._id = stack + ':' + this.constructor.name;
    // this._id = stack + ':' + this.constructor.name;
    // console.log('new__', this._id);

    this.tpl = tpl;
  }

  getId() {
    return this._id;
  }

  css(...arg) {
    // const cl_name = this.getId();
    if (this.is_reuse) {
      const comp = this._getSelfFromAggregat();
      return comp.$getCompCss(this._order_css++);
    } else {
      let obj;
      if (arg.length === 1 && typeof arg[0] === 'string') {
        obj = arg[0];
      }
      if (arg.length === 1 && arg[0] instanceof Object) {
        const class_name = this._ctx.generatorClass();
        obj = new CssClass(class_name, arg[0]);
      }
      if (arg.length === 2 && typeof arg[0] === 'string' && arg[1] instanceof Object) {
        const class_name = arg[0].replace(/^\./, '');
        obj = new CssClass(class_name, arg[1]);
      }
      // if (cl_name === 'User') {
      //   console.log('origin', obj);
      // }
      this._css.push(obj);
      return obj;
    }
  }

  makeRoot(setting = {}) {
    if (!setting.generatorClass) {
      generatoClassName.except(['ga']);
      setting.generatorClass = () => generatoClassName.next();
    }
    this._ctx = { generatorClass: setting.generatorClass, aggregator: {} };
    return this;
  }


  include(comp) {
    const name = comp.getId();
    comp.$setCtx(this._ctx);
    if (!this._ctx.aggregator[name]) {
      this._ctx.aggregator[name] = comp;
      const html = comp.$draw(this._data);

      // if (this.constructor.name === 'Container') {
      //   console.log('B this._css', this._css);
      // }
      this._css = [
        ...this.$getCompCss(),
        ...comp.$getCompCss()
      ];
      console.log(name, this.$getCompJs());
      this._js = {
        head: [ ...this.$getCompJs().head, ...comp.$getCompJs().head ],
        js: [ ...this.$getCompJs().js, ...comp.$getCompJs().js ]
      };

      return html;
    } else {
      comp.$usedRepeatedly();
      const html = comp.$draw(this._data);
      return html;
    }
  }

  t(statics, ...variables) {
    let out = '';
    for (let i = 0, l = statics.length; i < l; i++) {
      const str = statics[i];
      out += str;
      const variable = variables[i];
      if (variable instanceof Array) {
        variable.forEach(el => {
          if (el instanceof IgnisComp) {
            out += this._getForViewComp(el);
          } else if (el instanceof CssClass) {
            out += this._getForCssClass(el);
          } else {
            out += el;
          }
        });
      } else if (variable instanceof IgnisComp) {
        out += this._getForViewComp(variable);
      } else if (variable instanceof CssClass) {
        out += this._getForCssClass(variable);
      } else if (variable instanceof Object && variable !== null && variable.html) {
        out += this._getForObjComponent(variable);
      } else if (variable !== undefined && variable !== null) {
        out += variable;
      }
    }
    return out;
  }

  $getCompCss(index) {
    return typeof index === 'number' ? this._css[index] : this._css;
  }

  $getCompJs() {
    return this._js;
  }

  $draw() {
    return this.render(this._data);
  }

  $setCtx(ctx) {
    this._ctx = ctx;
    return this;
  }

  $usedRepeatedly() {
    this.is_reuse = true;
  }

  getCompCssAsString(){
    return format.style(this._css);
  }

  getCompJsAsString(){
    const list = this._js;
    const unwrap = el => el();
    console.log({
      head: list.head.map(unwrap),
      js: list.js.map(unwrap),
    });
    return {
      head: format.js(list.head.map(unwrap).flat()),
      js: format.js(list.js.map(unwrap).flat()),
    };
  }

  setSharedData(key, value) {
    const comp = this._getSelfFromAggregat();
    if (comp) {
      comp._shared_data[key] = value;
    } else {
      this._shared_data[key] = value;
    }
  }

  getSharedData(key, fallback) {
    const comp = this._getSelfFromAggregat();
    const shared_data = comp ? comp._shared_data : this._shared_data;
    return shared_data[key] || fallback;
  }

  cssLink(href) {
    return new CssLink(href);
  }

  link(href) {
    return new Link(href);
  }

  script(src) {
    return new Script(src);
  }

  headJs() {
    return [];
  }

  js() {
    return [];
  }

  _getForViewComp(value) {
    return this.include(value);
  }

  _getForObjComponent({ headJs, js, css, html }) {
    // Create inline component
    const comp = {
      _id: crypto.randomUUID(),
      getId() {
        return this._id;
      },
      $setCtx() {},
      $getCompJs() {
        return {
          head: headJs ? [ () => headJs ] : [],
          js: js ? [ () => js ] : []
        };
      },
      $getCompCss() {
        return [css||''];
      },
      $draw() {
        return html;
      }
    };
    return this.include(comp);
  }

  _getForCssClass(value) {
    return value.getName();
  }

  _getSelfFromAggregat() {
    const name = this.getId();
    return this._ctx?.aggregator[name];
  }

};


function _getCallerFile() {
  let filename;

  let _pst = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_err, stack) { return stack; };
  try {
    let err = new Error();
    let callerfile;
    let currentfile;

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift();
      if (currentfile !== callerfile.getFileName()) {
        filename = callerfile.getFileName() + ':' + callerfile.getLineNumber();
        break;
      }
    }
  // eslint-disable-next-line no-empty
  } catch (err) {}
  Error.prepareStackTrace = _pst;

  return filename;
}
