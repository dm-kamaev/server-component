'use strict';

// https://itchief.ru/html-and-css/media-queries
// https://webplatform.news/issues/2017-08-04
// https://www.bram.us/2021/10/26/media-queries-level-4-media-query-range-contexts/

/**
 *
 * @param {string} input - 300px <= width
 * @returns
 */
module.exports = function mediaRange(input) {
  input = input.replace(/^\(/, '').replace(/\)$/, '');
  // split by elements
  let els = input.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
  if (els.length === 3) {
    if (/^\d+/.test(els[0])) {
      els = swapSymbol(els);
    }
    const entity = els[0];
    const operator = els[1];
    const value = calcLimit(operator, els[2]);
    let max_min = '';
    if (operator === '<=' || operator === '<') {
      max_min = 'max';
    } else {
      max_min = 'min';
    }
    return `(${max_min}-${entity}:${value})`;
  } else if (els.length === 5) {
    return `${mediaRange(els.slice(0, 3).join(' '))} and ${mediaRange(els.slice(2, 5).join(' '))}`;
  }
};

const enum_opposite_operator = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

function swapSymbol(els) {
  const [left, operator, right ] = els;
  const opposite_operator = enum_opposite_operator[operator];
  if (!opposite_operator) {
    throw new Error(`Operator ${operator} is not valid`);
  }
  return [right, opposite_operator, left];
}


/**
 * calcLimit
 * @param {string} operator - >, <
 * @param {string} input - '300px'
 * @return 299.99px
 */
function calcLimit(operator, input) {
  let output = input;
  if (operator === '>') {
    const { groups } = input.match(/(?<digit>\d+)(?<measurement>\w+)/);
    output = `${groups.digit}.01${groups.measurement}`;
  } else if (operator === '<') {
    const { groups } = input.match(/(?<digit>\d+)(?<measurement>\w+)/);
    output = `${groups.digit - 1}.99${groups.measurement}`;
  }
  return output;
}