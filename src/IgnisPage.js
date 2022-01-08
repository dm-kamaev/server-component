'use strict';

const IgnisComp = require('./IgnisComp');
const CssClass = require('./CssClass');
const format = require('./format');

module.exports = class Page {

  constructor(data) {
    const root = new IgnisComp().makeRoot();
    this._root = root;
    this.t = root.t.bind(root);
    this.css = root.css.bind(root);
    this.cssLink = root.cssLink.bind(root);
    this.link = root.link.bind(root);
    this.script = root.script.bind(root);

    this._data = data;
  }

  beforeRender() {}

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
    this.beforeRender(data);

    const body = this.body(data);

    const compJs = this._root.getCompJsAsString();
    const head_js = format.js(this.headJs()) + compJs.head;
    const js = format.js(this.js()) + compJs.js;

    const ignoreCssClass = el => !(el instanceof CssClass);
    const style =
      format.style(this.style().filter(ignoreCssClass)) +
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

    // if (this.minify()) {
    //   page = page.replace(/\s+/g, ' ')
    //     .replace(/>\s+</g, '><')
    //     .replace(/>\s+/g, '>')
    //     .replace(/\s+</g, '<');
    // }
    return page;
  }
};

