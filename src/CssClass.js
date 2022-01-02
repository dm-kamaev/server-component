'use strict';


module.exports = class CssClass {
  constructor(name, obj) {
    this._name = name;
    this._obj = obj;
  }

  getName() {
    return this._name;
  }

  getBody() {
    let css = '';
    let subclasses = [];
    const obj = this._obj;
    Object.keys(obj).forEach(k => {
      if (k.startsWith('&')) {
        subclasses.push(
          new CssClass(this.getName() + k.replace(/^&/, ''), obj[k])
        );
      } else {
        css += `${kebabize(k)}:${obj[k]};`;
      }
    });
    return '.' + this.getName() + '{' + css + '}' + subclasses.map(el => el.getBody()).join('');
  }
};


function kebabize(str) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

// const CssClass = module.exports;
// const cl = new CssClass('article', {
//   'color': 'red',
//   '&:hover': {
//     'background-color': 'orange'
//   },
//   '&:focus': {
//     'background-color': 'orange'
//   }
// });

// console.log(cl.getBody());
