
import crypto from 'crypto';

import tpl from '@ignis-web/tpl';

import CssClass, { T_node } from './CssClass';
import CssLink from './CssLink';
import Link from './Link';
import Script from './Script';

import format from './format';

import generator, { I_gen_css_identifier } from './generator';


interface I_ctx {
  generatorClassName: () => string;
  generatorId: () => string;
  aggregator: Record<string, IgnisComp<any>>;
};

type I_functional_comp = { headJs?: string[], js?: string[], css?: string, html: string };

/**
 * D - type for data for render;
 * S - optional type for sharedData;
 */
export default class IgnisComp<D, S extends Record<string, any> = Record<string, any>> {
  private _order_css: number = 0;
  private _css: CssClass[];
  private _js: { head: (() => Array<string | Script>)[]; js: (() => Array<string | Script>)[]; };
  private _shared_data: S = {} as S;
  private _id: string;
  public tpl: any;
  private _is_reuse: boolean;
  private _ctx: I_ctx;

  constructor(private _data: D) {
    this._css = [];
    this._order_css = 0;

    this._js = { head: [() => this.headJs()], js: [() => this.js()] };

    const stack = _getCallerFile();
    this._id = stack + ':' + this.constructor.name;
    // this._id = stack + ':' + this.constructor.name;
    // console.log('new__', this._id);

    this.tpl = tpl;
  }

  // hook
  init(data: D) {}

  css(css: string): CssClass;
  css(css: T_node<string>): CssClass;
  css(className: string, css: T_node<string>): CssClass;
  css(...arg) {
    if (this._is_reuse) {
      const comp = this._getSelfFromAggregat();
      return comp.$getCompCss(this._order_css++);
    } else {
      let obj;
      if (arg.length === 1 && typeof arg[0] === 'string') {
        obj = arg[0];
      }
      if (arg.length === 1 && arg[0] instanceof Object) {
        const class_name = this._ctx.generatorClassName();
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

  makeRoot(input_settings: { generatorClassName: I_gen_css_identifier | null; generatorId?: I_gen_css_identifier | null } = { generatorClassName: null, generatorId: null }) {
    const settings: { generatorClassName: { next: () => string }; generatorId: { next: () => string }} = {} as any;
    settings.generatorClassName = input_settings.generatorClassName ?? generator.forClass();
    settings.generatorId = input_settings.generatorId ?? generator.forId();

    this._ctx = {
      generatorClassName: () => settings.generatorClassName.next(),
      generatorId: () => settings.generatorId.next(),
      aggregator: {}, // for cache components
    };
    return this;
  }


  include(comp: IgnisComp<any>) {
    const name = comp.$getId();
    comp.$setCtx(this._ctx);
    if (!this._ctx.aggregator[name]) {
      this._ctx.aggregator[name] = comp;
      const html = comp.$compile();

      // if (this.constructor.name === 'Container') {
      //   console.log('B this._css', this._css);
      // }
      this._css = [
        ...this.$getCompCss(),
        ...comp.$getCompCss()
      ];

      this._js = {
        head: [ ...this.$getCompJs().head, ...comp.$getCompJs().head ],
        js: [ ...this.$getCompJs().js, ...comp.$getCompJs().js ]
      };

      return html;
    } else {
      comp.$usedRepeatedly();
      const html = comp.$compile();
      return html;
    }
  }

  t(statics: TemplateStringsArray, ...variables: Array<CssClass[] | IgnisComp<any>[] | IgnisComp<any> | CssClass | I_functional_comp | number | string>) {
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
      } else if (variable instanceof Object && variable !== null && typeof variable.html === 'string') {
        out += this._getForObjComponent(variable);
      } else if (variable !== undefined && variable !== null) {
        out += variable;
      }
    }
    return out;
  }


  $getId() {
    return this._id;
  }

  $getCompCss(): CssClass[];
  $getCompCss(index: number): CssClass;
  $getCompCss(index?: number) {
    return typeof index === 'number' ? this._css[index] : this._css;
  };

  $getCompJs() {
    return this._js;
  }

  $compile() {
    this.init(this._data);
    return this.render(this._data);
  }

  render(_data: D) {
    throw new Error("Method not implemented.");
  }

  $setCtx(ctx: I_ctx) {
    this._ctx = ctx;
    return this;
  }

  $usedRepeatedly() {
    this._is_reuse = true;
  }

  createId() {
    return this._ctx.generatorId();
  }

  createClassName() {
    return this._ctx.generatorClassName();
  }

  getCompCssAsString(){
    return format.style(this._css);
  }

  getCompJsAsString(){
    const list = this._js;
    const unwrap = el => el();
    return {
      head: format.js(list.head.map(unwrap).flat()),
      js: format.js(list.js.map(unwrap).flat()),
    };
  }

  setSharedData<K extends keyof S & string>(key: K, value: S[K]) {
    const comp = this._getSelfFromAggregat();
    if (comp) {
      comp._shared_data[key] = value;
    } else {
      this._shared_data[key] = value;
    }
  }

  getSharedData<K extends keyof S & string>(key: K, fallback?: any): S[K] {
    const comp = this._getSelfFromAggregat();
    const shared_data = comp ? comp._shared_data : this._shared_data;
    return shared_data[key] || fallback;
  }

  cssLink(href: string) {
    return new CssLink(href);
  }

  link(href: string) {
    return new Link(href);
  }

  script(src: string) {
    return new Script(src);
  }

  headJs(): Array<string | Script> {
    return [];
  }

  js(): Array<string | Script> {
    return [];
  }

  private _getForViewComp(value: IgnisComp<any>) {
    return this.include(value);
  }

  private _getForObjComponent({ headJs, js, css, html }: I_functional_comp) {
    // Create inline component
    const comp = {
      _id: crypto.randomUUID(),
      $getId() {
        return this._id;
      },
      $setCtx() { },
      $getCompJs() {
        return {
          head: headJs ? [() => headJs] : [],
          js: js ? [() => js] : []
        };
      },
      $getCompCss() {
        return [css || ''];
      },
      $compile() {
        return html;
      }
    } as unknown as IgnisComp<any>;
    return this.include(comp);
  }

  private _getForCssClass(value: CssClass) {
    return value.getName();
  }

  private _getSelfFromAggregat() {
    const name = this.$getId();
    return this._ctx?.aggregator[name];
  }

};



function _getCallerFile(): string {
  let filename;

  let _pst = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_err, stack) { return stack; };
  try {
    let err: { stack: { getFileName: () => string }[] } = new Error() as any;
    let callerfile;
    let currentfile;

    currentfile = err.stack.shift()?.getFileName();

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
