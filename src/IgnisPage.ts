import IgnisComp from './IgnisComp';
import CssClass from './CssClass';
import format from './format';
import Script from './Script';
import CssLink from './CssLink';
import Link from './Link';
import Minify from './Minify';

export default class IgnisPage<D> {
  t: (statics: any, ...variables: any[]) => string;
  css: (...arg: any[]) => any;
  cssLink: (href: string) => ReturnType<IgnisComp<any>['cssLink']>;
  link: (href: string) => ReturnType<IgnisComp<any>['link']>;
  script: (src: string) => ReturnType<IgnisComp<any>['script']>;
  createId: () => string;
  createClassName: () => string;
  tpl: any;
  private _root: IgnisComp<Record<string, any>>;
  private _minify: Minify;

  constructor(private _data: D) {
    const root = new IgnisComp({}).makeRoot({
      ...this.generators(),
    });
    this._root = root;
    this.t = root.t.bind(root);
    this.css = root.css.bind(root);
    this.cssLink = root.cssLink.bind(root);
    this.link = root.link.bind(root);
    this.script = root.script.bind(root);
    this.createId = root.createId.bind(root);
    this.createClassName = root.createClassName.bind(root);

    this.tpl = root.tpl;

    this._minify = new Minify(this.minify());
  }

  // hook
  protected init(data: D) {}

  generators() {
    return {
      generatorClassName: null,
      generatorId: null,
    };
  }
  // generatorClassName() {}
  // generatorId() {}

  // hook
  addStyleToEnd(): Array<CssLink | string> {
    return [];
  }


  minify() {
    return false;
  }

  htmlTag() {
    return '<html lang="EN">';
  }

  head() {
    return [
      '<meta charset="UTF-8">',
      '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    ];
  }

  title() {
    return 'Hello, I am page with IgnisComponent !';
  }

  description() {
    return '';
  }

  keywords() {
    return '';
  }

  style(): Array<string | CssLink | Link> {
    return [];
  }

  headJs(): Array<string | Script> {
    return [];
  }

  js(): Array<string | Script> {
    return [];
  }


  render(data = this._data) {
    this.init(data);

    const ignoreCssClass = el => !(el instanceof CssClass);

    const pageStyle = this.style().filter(ignoreCssClass);

    const body = this.body(data) as unknown as string;

    const compJs = this._root.getCompJsAsString();
    const head_js = format.js(this.headJs()) + compJs.head;
    const js = format.js(this.js()) + compJs.js;

    const style =
      format.style(pageStyle) +
      this._root.getCompCssAsString() +
      format.style(this.addStyleToEnd().filter(ignoreCssClass));

    const page =
      '<!DOCTYPE html>'+
        this.t`${this.htmlTag()}`+
          '<head>'+
            this.t`${this._minify.html(format.title(this.title()))}`+
            this.t`${this._minify.html(format.description(this.description()))}`+
            this.t`${this._minify.html(format.keywords(this.keywords()))}`+

            this.t`${this.head()}`+

            this.t`${this._minify.style(style)}`+
            this.t`${head_js}`+
          '</head>'+
          '<body>'+
            this.t`${this._minify.html(body)}`+
            this.t`${js}`+
          '</body>'+
        '</html>'
   ;

    return page;
  }

  protected body(data: D) {
    throw new Error('Method not implemented.');
  }
};

