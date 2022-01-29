'use strict';

const IgnisComp = require('./IgnisComp');
const CssClass = require('./CssClass');
const format = require('./format');

module.exports = class Page {

  constructor(data) {
    const root = new IgnisComp().makeRoot({
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

    this._data = data;
  }

  // hook
  init() {}

  generators() {
    return {
      generatorClassName: null,
      generatorId: null,
    };
  }
  // generatorClassName() {}
  // generatorId() {}

  // hook
  addStyleToEnd() {
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

  style() {
    return [];
  }

  headJs() {
    return [];
  }

  js() {
    return [];
  }

  _minifyStyle(css) {
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

  _minifyHtml(html) {
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

    const body = this.body(data);

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
};

