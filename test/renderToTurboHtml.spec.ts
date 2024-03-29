import { IgnisComp, createRenderToTurboHtml } from '../index';
import Script from '../src/Script';

describe('[CompToTurboHtml.ts]', function () {

  beforeAll(() => {
    Script.createOnloadName = () => 'onload';
  });

  it('render as object { id, html, css, js }', function () {
    class ListBook extends IgnisComp<{ id: number, author: string, name: string, year: number }[]> {

      render(books: { id: number, author: string, name: string, year: number }[]) {

        this.css('@media screen and (max-width: 599px) { .columns{display:block}}');
        this.css('.column{display:flex;border-left:12px solid red;}');
        this.css(this.cssLink('https://cdn.jsdelivr.net/npm/@mdi/font@6.4.95/css/materialdesignicons.min.css'));
        return this.t`
        <div id=${this.createId()} class=${this.createClassName()}>
          <p>Count: ${books.length}</p>
          ${books.map(el => new Book(el))}
          ${funcComponent('Refresh all')}
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
          this.script('https://cdnjs.cloudflare.com/ajax/libs/jquery.js'),
          'console.log("This js code before </body>");',
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

    function funcComponent(text: string) {
      const css = `
        .refresh{border:1px solid red}
      `;
      const html = `
        <form class=refresh action="#">
          <button type=submit>${text}</button>
        </form>
      `;

      const headJs = ['console.log("I am functional component in head");', ' <script>alert("1");</script>'];
      const js = ['console.log("I am functional component in footer");'];

      return { headJs: headJs, js: js, html, css };
    }

    const renderToTurboHtml = createRenderToTurboHtml({ minify: false });
    const data = renderToTurboHtml('test', () => new ListBook([
      { id: 1, author: 'Leo Tolstoy', name: 'War and Peace', year: 1863 },
      { id: 2, author: 'Jack London', name: 'White Fang', year: 1906 }
    ]));

    expect(data.id).toBe('test');
    expect(data.html).toBeEqualStr(`
        <div id=Z class=a>
          <p>Count: 2</p>
          <div id=1 class=b>
            <p class=list-book__name>Name: War and Peace</p>
            <p class=list-book__author>Author: Leo Tolstoy</p>
            <p>Year: 1863</p>
          </div>

          <div id=2 class=b>
            <p class=list-book__name>Name: White Fang</p>
            <p class=list-book__author>Author: Jack London</p>
            <p>Year: 1906</p>
          </div>

          <form class=refresh action="#">
            <button type=submit>Refresh all</button>
          </form>

        </div>
    `);

    expect(data.css).toBeEqualStr(`
        <style>@media screen and (max-width: 599px) { .columns{display:block}}.column{display:flex;border-left:12px solid red;}</style><link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/@mdi/font@6.4.95/css/materialdesignicons.min.css"/><style>.b{color:red;}.b:focus{background-color:orange;}.list-book__author{text-transform:capitalize;}.list-book__name{font-size: 16px}
        .refresh{border:1px solid red}
      </style>
    `);

    expect(data.js).toBeEqualStr(`
        <script>console.log("This js code in <head></head>")</script><script>function onload(){console.log("Highcharts is loading");}</script><script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js" async onload="onload();"></script><script>console.log("I am functional component in head");</script> <script>alert("1");</script><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.js"></script><script>console.log("This js code before </body>");console.log("I am functional component in footer");</script>
    `);


  });

});
