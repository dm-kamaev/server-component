import Link from './Link';
import Script from './Script';
import CssClass from './CssClass';

export default {
  title(title: string) {
    title = title.trim().replace(/\s+/g, ' ')
      .replace(/&/g, '&amp;')
      .replace(/\"/g, '\'');
    return '<title>' + title + '</title>';
  },
  description(description: string) {
    description = description.trim().replace(/\s+/g, ' ')
      .replace(/&/g, '&amp;')
      .replace(/\"/g, '\'');
    return '<meta name="description" content="' + description + '">';
  },
  keywords(keywords: string) {
    keywords = keywords.trim().replace(/\s+/g, ' ')
      .replace(/&/g, '&amp;')
      .replace(/\"/g, '\'');
    return '<meta name="keywords" content="' + keywords + '">';
  },
  style: formatStyle,
  js: formatJs
};


function formatStyle(list: Array<CssClass | Link | string>) {
  let res = '';
  const tag = new StateTag('<style>', '</style>');
  list.forEach(el => {
    if (el instanceof CssClass) {
      res += tag.open();
      res += el.getBody();
    } else if (el instanceof Link) {
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


function formatJs(list: Array<Script | string>) {
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
  private _is_open_tag: boolean;
  constructor(private open_tag, private close_tag) {
    this._is_open_tag = false;
  }

  open() {
    let str = '';
    if (!this._is_open_tag) {
      this._is_open_tag = true;
      // eslint-disable-next-line no-unused-vars
      str += this.open_tag;
    }
    return str;
  }

  close() {
    let str = '';
    if (this._is_open_tag) {
      this._is_open_tag = false;
      // eslint-disable-next-line no-unused-vars
      str += this.close_tag;
    }
    return str;
  }
}

