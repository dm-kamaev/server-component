import IgnisComp from './IgnisComp';
import CssClass from './CssClass';
import format from './format';
import Script from './Script';
import CssLink from './CssLink';
import Link from './Link';

export default class Page<D extends Record<string, any>> {
  t: (statics: any, ...variables: any[]) => string;
  css: (...arg: any[]) => any;
  cssLink: (href: string) => ReturnType<IgnisComp<any>['cssLink']>;
  link: (href: string) => ReturnType<IgnisComp<any>['link']>;
  script: (src: string) => ReturnType<IgnisComp<any>['script']>;
  createId: () => string;
  createClassName: () => string;
  tpl: any;
  private _root: IgnisComp<Record<string, any>>;

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

  }

  // hook
  init(data: D) {}

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

  style(): Array<CssLink | Link> {
    return [];
  }

  headJs(): Array<string | Script> {
    return [];
  }

  js(): Array<Script | string> {
    return [];
  }

  _minifyStyle(css: string) {
    if (this.minify()) {
      return css.replace(/\/\*[^\/\*\*\/]+\*\//g, '') // коментарии вида /**/
        .replace(/\s+/g, ' ')
        .replace(/\s+{\s+/g, '{')
        .replace(/\s+}\s+/g, '}')
        .replace(/;\s+/g, ';')
        .replace(/:\s+/g, ':')
        .replace(/{\s+/g, '{')
        .replace(/\s+}/g, '}')
        .trim();
    } else {
      return css;
    }
  }

  _minifyHtml(html: string) {
    if (this.minify()) {
      return html.replace(/\s+/g, ' ') // нельзя слитно ибо аттрибуты тэгов должны иметь пробелы
        .replace(/>\s+</g, '><')
        .replace(/>\s+/g, '>')
        .replace(/\s+</g, '<')
        .trim();
    } else {
      return html;
    }
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

    let page =
      '<!DOCTYPE html>'+
        this.t`${this.htmlTag()}`+
          '<head>'+
            this.t`${this._minifyHtml(format.title(this.title()))}`+
            this.t`${this._minifyHtml(format.description(this.description()))}`+
            this.t`${this._minifyHtml(format.keywords(this.keywords()))}`+

            this.t`${this.head()}`+

            this.t`${this._minifyStyle(style)}`+
            this.t`${head_js}`+
          '</head>'+
          '<body>'+
            this.t`${this._minifyHtml(body)}`+
            this.t`${js}`+
          '</body>'+
        '</html>'
   ;

    return page;
  }

  body(data: D) {
    throw new Error('Method not implemented.');
  }
};

