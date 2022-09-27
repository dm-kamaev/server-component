'use strict';

import { IgnisComp } from '../../index';
import Script from '../../src/Script';

describe('[IgnisComp.js]', function () {

  beforeAll(() => {
    Script.createOnloadName = () => 'onload';
  });

  it('functional component', async function () {
    class ListBook extends IgnisComp<{ id: number, author: string, name: string, year: number }[]> {
      render(books) {
        return this.t`
          <div>
            <p>Count: ${books.length}</p>
            ${books.map(el => new Book(el))}
          </div>
        `;
      }
    }

    class Book extends IgnisComp<{ id: number, author: string, name: string, year: number }> {

      headJs() {
        const ids = this.getSharedData('ids');
        return [
          'console.log("This js code in <head></head>")',
          this.script('https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js')
            .async()
            .onload('console.log("Highcharts is loading");'),
          `[${ids.join(',')}].forEach(id => new Book(id);`
        ];
      }

      js() {
        const ids = this.getSharedData('ids');
        return [
          this.script('https://cdnjs.cloudflare.com/ajax/libs/jquery.js'),
          'console.log("This js code before </body>");',
          `console.log("book ids = ", [${ids.join(',')}]);`
        ];
      }

      render({ id, author, name, year }) {
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

        const ids = this.getSharedData('ids', []);
        ids.push(id);
        this.setSharedData('ids', ids);


        return this.t`
          <div id=${id} class=${cl_book}>
            <p class=list-book__name>Name: ${name}</p>
            <p class=${cl_author}>Author: ${author}</p>
            ${funcComponent(year)}
          </div>
        `;
      }

    }

    function funcComponent(year) {
      const css = `
        .book-year{border:1px solid red}
      `;
      const html = `
          <p class=book-year>Year: ${year}</p>
      `;

      const headJs = ['console.log("I am functional component in head");', ' <script>alert("1");</script>'];
      const js = ['console.log("I am functional component in footer");'];

      return { headJs: headJs, js: js, html, css };
    }

    const comp = new ListBook([
      { id: 1, author: 'Leo Tolstoy', name: 'War and Peace', year: 1863 },
      { id: 2, author: 'Jack London', name: 'White Fang', year: 1906 }
    ]).makeRoot();

    expect(comp.$compile()).toBeEqualStr(`
      <div>
        <p>Count: 2</p>

      <div id=1 class=a>
        <p class=list-book__name>Name: War and Peace</p>
        <p class=list-book__author>Author: Leo Tolstoy</p>
        <p class=book-year>Year: 1863</p>
      </div>

      <div id=2 class=a>
        <p class=list-book__name>Name: White Fang</p>
        <p class=list-book__author>Author: Jack London</p>
        <p class=book-year>Year: 1906</p>
      </div>

      </div>`);

    // console.log(comp.getCompCssAsString());
    expect(comp.getCompCssAsString()).toBeEqualStr(
      '<style>.a{color:red;}.a:focus{background-color:orange;}.list-book__author{text-transform:capitalize;}.list-book__name{font-size: 16px} .book-year{border:1px solid red} </style>'
    );

    const { head, js } = comp.getCompJsAsString();

    expect(head).toBe(
      '<script>console.log("This js code in <head></head>")</script><script>function onload(){console.log("Highcharts is loading");}</script><script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js" async onload="onload();"></script><script>[1,2].forEach(id => new Book(id);console.log("I am functional component in head");</script> <script>alert("1");</script>'
    );
    expect(js).toBe(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.js"></script><script>console.log("This js code before </body>");console.log("book ids = ", [1,2]);console.log(\"I am functional component in footer\");</script>'
    );

  });


});