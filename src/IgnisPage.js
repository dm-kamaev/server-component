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
    const body = this.body(data);

    const compJs = this._root.getCompJsAsString();
    const head_js = format.js(this.headJs()) + compJs.head;
    const js = format.js(this.js()) + compJs.js;

    const style = format.style(this.style().filter(el => !(el instanceof CssClass))) + this._root.getCompCssAsString();

    return this.t`
      <!DOCTYPE html>
      ${this.htmlTag()}
      <head>
        ${format.title(this.title())}
        ${format.description(this.description())}
        ${format.keywords(this.keywords())}

        ${this.head()}

        ${this._minifyStyle(style)}
        ${head_js}
      </head>
      <body>
        ${this._minifyHtml(body)}
        ${js}
      </body>
      </html>
   `;
  }
};

