'use strict';

const { IgnisComp, IgnisPage } = require('./index');


class ListBook extends IgnisComp {
  render(books) {
    return this.t`
      <div>
        <p>Count: ${books.length}</p>
        ${books.map(el => new Book(el))}
      </div>
    `;
  }
}

class Book extends IgnisComp {

  headJs() {
    const ids = this.getSharedData('ids');
    return [
      this.script('zoom.js'),
      `new Zoom(${ids.join(',')});`
    ];
  }

  js() {
    return [
      this.script().code('console.log(23445);'),
    ];
  }


  render({ id, author, name, year }) {
    const cl_book = this.css({
      color: 'red',
      '&:focus': {
        'background-color': 'orange'
      }
    });

    this.css('.list-book__name{font-size: 16px}');

    const ids = this.getSharedData('ids', []);
    ids.push(id);
    this.setSharedData('ids', ids);

    return this.t`
      <div class=${cl_book}>
        <p class=list-book__name>Name: ${name}</p>
        <p>Author: ${author}</p>
        <p>Year: ${new BookYear(year)}</p
      </div>
    `;
  }
}


class BookYear extends IgnisComp {

  headJs() {
    return [
      'console.log("I am code in head 1!");',
      this.script('jquery.js').async().onload('console.log("I am loading");'),
      'console.log("I am code in head 2!");',
      'console.log("I am code in head 3!");',
    ];
  }

  js() {
    return [
      'console.log("I am code in footer 1!");',
      'console.log("I am code in footer 2!");',
      'console.log("I am code in footer 3!");',
      this.script('highcharts.js').async().onload('console.log("I am loading");')
    ];
  }

  render(year) {
    const cl_early_year = this.css({
      color: 'green',
    });

    const cl_middle_year = this.css({
      color: 'orange',
    });

    const cl_late_year = this.css({
      color: 'blue',
    });

    return this.t`
      ${this.tpl
        .if(year < 1600, () => this.t`<span class=${cl_early_year}>${year}</span>`)
        .else_if(year > 1600 && year > 1900, () => this.t`<span class=${cl_middle_year}>${year}</span>`)
        .else(this.t`<span class=${cl_late_year}>${year}</span>`)
      }
    `;
  }
}




class Page extends IgnisPage {

  minify() {
    return false;
  }

  style() {
    return [
      this.cssLink('bulma-container.css'),
      this.css('.column', { display: 'flex', borderLeft: '12px solid red' })
    ];
  }


  headJs() {
    return [
      this.script('stimulus.js').async()
    ];
  }

  js() {
    return [
      this.script('react.js')
    ];
  }


  body(books) {
    return this.t`
      <div class=columns>
        <div class=column>
          ${new ListBook(books)}
        </div>
      </div>
    `;
  }
}




const html = new Page([
  { id: 1, author: 'Leo Tolstoy', name: 'War and Peace', year: 1863 },
  { id: 2, author: 'Jack London', name: 'White Fang', year: 1906 }
]).render();
console.log(html);
