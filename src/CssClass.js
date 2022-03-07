'use strict';


module.exports = class CssClass {

  static mediaRange(rule) {
    return mediaRange(rule);
  }

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

// https://itchief.ru/html-and-css/media-queries
// https://webplatform.news/issues/2017-08-04
function mediaRange(input) {
  input = input.replace(/^\(/, '').replace(/\)$/, '');
  // split by elements
  let els = input.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
  if (els.length === 3) {
    if (/^\d+/.test(els[0])) {
      els = swap_symbol(els);
    }
    const entity = els[0];
    const operator = els[1];
    const px = els[2];
    let max_min = '';
    if (operator === '<=' || operator === '<') {
      max_min = 'max';
    } else {
      max_min = 'min';
    }
    return `(${max_min}-${entity}:${px})`;
  } else if (els.length === 5) {
    return `${mediaRange(els.slice(0, 3).join(' '))} and ${mediaRange(els.slice(2, 5).join(' '))}`;
  }
}

// console.log(convert_to_old_syntax('width > 750px'));
// console.log(mediaRange('(300px <= width <= 750px)'));

const enum_opposite_operator = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

function swap_symbol(els) {
  const [left, operator, right ] = els;
  const opposite_operator = enum_opposite_operator[operator];
  if (!opposite_operator) {
    throw new Error(`Operator ${operator} is not valid`);
  }
  return [right, opposite_operator, left];
}

// console.log(swap_symbol('300px <= width'.split(' ')).join(' '));


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
