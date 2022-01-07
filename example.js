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

  // javascript for all components Book. It will be place in <head></head>
  headJs() {
    // get all ids for components Book
    const ids = this.getSharedData('ids');
    return [
      this.script('/assets/book.js'),
      `[${ids.join(',')}].forEach(id => new Book(id);`
    ];
  }

  // javascript for all components Book. It will be place before tag <body> close
  js() {
    return [
      'console.log("I am book in footer!!!");',
    ];
  }


  render({ id, author, name, year }) {
    // create class via css in js
    const cl_book = this.css({
      color: 'red',
      '&:focus': {
        'background-color': 'orange'
      }
    });

    const cl_author = this.css('list-book__author', {
      textTransform: 'capitalize'
    });

    // create class as simple string
    this.css('.list-book__name{font-size: 16px}');

    // You can store shared data for specific type components(in this case Book)  which were used on page
    const ids = this.getSharedData('ids', []);
    ids.push(id);
    this.setSharedData('ids', ids);

    return this.t`
      <div class=${cl_book}>
        <p class=list-book__name>Name: ${name}</p>
        <p class=${cl_author}>Author: ${author}</p>
        <p>Year: ${new BookYear(year)}</p
      </div>
    `;
  }
}


class BookYear extends IgnisComp {

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

    // tpl is built in library for convenient work with conditions in template
    return this.t`
      ${this.tpl
        .if(year < 1600, () => this.t`<span class=${cl_early_year}>${year}</span>`)
        .else_if(year > 1600 && year > 1900, () => this.t`<span class=${cl_middle_year}>${year}</span>`)
        .else(this.t`<span class=${cl_late_year}>${year}</span>`)
      }
    `;
  }
}


function funcComponent() {
  const css = `
    .example-description{border:1px solid red}
  `;
  const html = `
    <section>
        <header>I am functional component</header>
        <footer class=example-description></footer>
    </section>
  `;

  const headJs = ['console.log("I am functional component in head");', ' <script>alert("1");</script>'];
  const js = ['console.log("I am functional component in footer");'];

  return { headJs: headJs, js: js, html, css };
}


class Page extends IgnisPage {

  // set true, if you want remove spaces, comments from final html and css
  minify() {
    return false;
  }

  // global style for html page
  style() {
    return [
      this.cssLink('https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma-rtl.min.css'),
      this.css('.column', { display: 'flex', borderLeft: '12px solid red' })
    ];
  }

  // global javascript for section: It will be place in <head></head>
  headJs() {
    return [
      this.script('https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js')
        .async()
        .onload('console.log("Highcharts is loading");')
    ];
  }

  // global javascript for footer. It will be place before tag <body> close
  js() {
    return [
      'console.log("I am run in end of page");',
    ];
  }

  // It will be place in <body></body>
  body(books) {
    return this.t`
      <div class=columns>
        <div class=column>
          ${new ListBook(books)}
          ${funcComponent()}
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
