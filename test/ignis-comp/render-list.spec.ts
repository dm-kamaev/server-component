'use strict';

import { IgnisComp } from '../../index';
import Script from '../../src/Script';

describe('[IgnisComp.js]', function () {

  beforeAll(() => {
    Script.createOnloadName = () => 'onload';
  });

  it('render list', async function () {
    class ListBook extends IgnisComp<{ id: number, author: string, name: string, year: number }[]> {
      render(books: { id: number, author: string, name: string, year: number }[]) {
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
        return [
          'console.log("This js code in <head></head>")',
          this.script('https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js')
            .async()
            .onload('console.log("Highcharts is loading");')
        ];
      }

      js() {
        return [
          this.script('https://unpkg.com/axios/dist/axios.min.js'),
          'console.log("This js code before </body>")',
        ];
      }

      render({ id, author, name, year }: { id: number, author: string, name: string, year: number }) {
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


        return this.t`
          <div id=${id} class=${cl_book}>
            <p class=list-book__name>Name: ${name}</p>
            <p class=${cl_author}>Author: ${author}</p>
            <p>Year: ${year}</p>
          </div>
        `;
      }
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
        <p>Year: 1863</p>
      </div>

      <div id=2 class=a>
        <p class=list-book__name>Name: White Fang</p>
        <p class=list-book__author>Author: Jack London</p>
        <p>Year: 1906</p>
      </div>

      </div>`);

    expect(comp.getCompCssAsString()).toBeEqualStr(
      '<style>.a{color:red;}.a:focus{background-color:orange;}.list-book__author{text-transform:capitalize;}.list-book__name{font-size: 16px}</style>'
    );

    const { head, js } = comp.getCompJsAsString();

    expect(head).toBe(
      '<script>console.log("This js code in <head></head>")</script><script>function onload(){console.log("Highcharts is loading");}</script><script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js" async onload="onload();"></script>'
    );
    expect(js).toBe(
      '<script src="https://unpkg.com/axios/dist/axios.min.js"></script><script>console.log("This js code before </body>")</script>'
    );

  });


});
