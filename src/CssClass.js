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
    let media = [];
    const obj = this._obj;
    Object.keys(obj).forEach(k => {
      if (k.startsWith('&')) {
        subclasses.push(
          new CssClass(this.getName() + k.replace(/^&/, ''), obj[k])
        );
      } else if (k.startsWith('@')) {
        const value = obj[k];
        media.push({
          condition: k,
          el: new CssClass(this.getName(), value),
        });
      } else {
        css += `${kebabize(k)}:${obj[k]};`;
      }
    });
    return '.' + this.getName() + '{' + css + '}' + subclasses.map(el => el.getBody()).join('') + build_media_rules(media);
  }

};


function kebabize(str) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

// build rules for @media
function build_media_rules(media) {
  return media.map(({ condition, el }) => {
    return `${condition}{${el.getBody()}}`;
  }).join('');
}

// const CssClass = module.exports;
// const cl = new CssClass('article', {
//   'color': 'red',
//   '&:hover': {
//     'background-color': 'orange'
//   },
//   '&:focus': {
//     'background-color': 'orange'
//   },
//   // [`@media screen and ${mediaRange('300px <= width <= 750px')}`]: {
//   // [`@media screen and ${mediaRange('300px <= width')}`]: {
//   [`@media screen and ${mediaRange('width >= 300px')}`]: {
//     'font-size': '120px',
//     '&:focus': {
//       'background-color': 'green'
//     },
//   },
// });

// console.log(cl.getBody());

// '@media screen and (' + key + '){' +
//   css_for_size +
//   '}';


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
