'use strict';

const CssLink = require('./CssLink');
const Script = require('./Script');
const CssClass = require('./CssClass');
const Link = require('./Link');

module.exports = {
  title(title) {
    title = title.trim().replace(/\s+/g, ' ')
      .replace(/&/g, '&amp;')
      .replace(/\"/g, '\'');
    return '<title>' + title + '</title>';
  },
  description(description) {
    description = description.trim().replace(/\s+/g, ' ')
      .replace(/&/g, '&amp;')
      .replace(/\"/g, '\'');
    return '<meta name="description" content="' + description + '">';
  },
  keywords(keywords) {
    keywords = keywords.trim().replace(/\s+/g, ' ')
      .replace(/&/g, '&amp;')
      .replace(/\"/g, '\'');
    return '<meta name="keywords" content="' + keywords + '">';
  },
  style: formatStyle,
  js: formatJs
};


function formatStyle(list) {
  let res = '';
  const tag = new StateTag('<style>', '</style>');
  list.forEach(el => {
    if (el instanceof CssClass) {
      res += tag.open();
      res += el.getBody();
    } else if (el instanceof CssLink || el instanceof Link) {
      res += tag.close();
      res += el.toString();
    } else {
      res += tag.open();
      res += el;
    }
  });

  res += tag.close();

  return res;
}


function formatJs(list) {
  let res = '';
  const tag = new StateTag('<script>', '</script>');
  list.forEach(el => {
    if (el instanceof Script) {
      res += tag.close();
      res += el;
    } else if (typeof el === 'string' && el.trim().startsWith('<script>')) {
      res += tag.close();
      res += el;
    } else {
      res += tag.open();
      res += el;
    }
  });

  res += tag.close();

  return res;
}



class StateTag {
  constructor(open_tag, close_tag) {
    this.is_open_tag = false;
    this.open_tag = open_tag;
    this.close_tag = close_tag;
  }

  open() {
    let str = '';
    if (!this.is_open_tag) {
      this.is_open_tag = true;
      // eslint-disable-next-line no-unused-vars
      str += this.open_tag;
    }
    return str;
  }

  close() {
    let str = '';
    if (this.is_open_tag) {
      this.is_open_tag = false;
      // eslint-disable-next-line no-unused-vars
      str += this.close_tag;
    }
    return str;
  }
}

