'use strict';

import { IgnisComp, IgnisPage } from '../../index';
import Script from '../../src/Script';

import GenCssIdentifier from '@ignis-web/gen-css-identifier';


describe('[IgnisPage.js]', function () {
  let generatorId;
  let generatorClassName;


  beforeAll(() => {
    Script.createOnloadName = () => 'onload';
    generatorId = new GenCssIdentifier('987');
    generatorClassName = new GenCssIdentifier('#$!');

  });

  it('whole html page', async function () {
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

    class Page extends IgnisPage<{ id: number, author: string, name: string, year: number }[]> {

      minify() {
        return false;
      }

      generators() {
        return {
          generatorId,
          generatorClassName
        };
      }

      addStyleToEnd() {
        return [
          this.cssLink('/assets/global-v1.css'),
          '@media screen and (max-width: 599px) { .columns{display:block}}'
        ];
      }

      keywords() {
        return `
          keywords
        `;
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
          this.script('https://unpkg.com/three@0.137.4/build/three.js')
            .async()
            .onload('console.log("Three js is loading");')
        ];
      }

      // global javascript for footer. It will be place before tag <body> close
      js() {
        return [
          'console.log("I am run in end of page");',
        ];
      }

      // It will be place in <body></body>
      body(books: { id: number, author: string, name: string, year: number }[]) {
        const id = this.createId();
        const cls = this.createClassName();
        return this.t`
          <div id=${id} class="columns ${cls}">
            <div class=column>
              ${new ListBook(books)}
              ${funcComponent('Refresh all')}
            </div>
          </div>
        `;
      }
    }

    function funcComponent(text) {
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

    const html = new Page([
      { id: 1, author: 'Leo Tolstoy', name: 'War and Peace', year: 1863 },
      { id: 2, author: 'Jack London', name: 'White Fang', year: 1906 }
    ]).render();

    expect(html).toBeEqualStr(`
      <!DOCTYPE html><html lang="EN"><head><title>Hello, I am page with IgnisComponent !</title><meta name="description" content=""><meta name="keywords" content="keywords"><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma-rtl.min.css"/><style>.column{display:flex;border-left:12px solid red;}.\${color:red;}.\$:focus{background-color:orange;}.list-book__author{text-transform:capitalize;}.list-book__name{font-size: 16px}
        .refresh{border:1px solid red}
      </style><link rel="stylesheet" type="text/css" href="/assets/global-v1.css"/><style>@media screen and (max-width: 599px) { .columns{display:block}}</style><script>function onload(){console.log("Three js is loading");}</script><script src="https://unpkg.com/three@0.137.4/build/three.js" async onload="onload();"></script><script>console.log("This js code in <head></head>")</script><script>function onload(){console.log("Highcharts is loading");}</script><script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js" async onload="onload();"></script><script>console.log("I am functional component in head");</script> <script>alert("1");</script></head><body>
          <div id=9 class="columns #">
            <div class=column>

          <div>
            <p>Count: 2</p>

          <div id=1 class=$>
            <p class=list-book__name>Name: War and Peace</p>
            <p class=list-book__author>Author: Leo Tolstoy</p>
            <p>Year: 1863</p>
          </div>

          <div id=2 class=$>
            <p class=list-book__name>Name: White Fang</p>
            <p class=list-book__author>Author: Jack London</p>
            <p>Year: 1906</p>
          </div>

          </div>


          <form class=refresh action="#">
            <button type=submit>Refresh all</button>
          </form>

            </div>
          </div>
        <script>console.log("I am run in end of page");</script><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.js"></script><script>console.log("This js code before </body>");console.log("I am functional component in footer");</script></body></html>
    `);

  });


});
