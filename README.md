# Server-component

[![Actions Status](https://github.com/dm-kamaev/server-component/workflows/Build/badge.svg)](https://github.com/dm-kamaev/server-component/actions) ![Coverage](https://github.com/dm-kamaev/server-component/blob/master/badges/coverage.svg)

A minimalistic framework for creating reusable and encapsulated html components on server side.
It doesn't require special parser like babel or bundler (as Webpack) to work, because it uses standard abilities of javascript and all the power of templates function 🚀 .
The framework uses ideology of **CssInJs** for work with css.

It was inspired by  React (JSX) and [ViewComponent](https://viewcomponent.org/).
### Install
```sh
npm i @ignis-web/server-component -S
```


### Introduce
For example, we create two components: `List Book`, `Book` and you will see the basic capabilities such as component approach and isolated `css in js`.
```js
const { IgnisComp } = require('@ignis-web/server-component');

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
  // js code for <head>
  headJs() {
    return [
      'console.log("This js code in <head></head>")',
      this.script('/assets/js/book.js')
        .async()
        .onload('console.log("Component is loading");')
    ];
  }

  // js code before </body>
  js() {
    return [
      this.script('https://cdnjs.cloudflare.com/ajax/libs/jquery.js'),
      'console.log("This js code before </body>")',
    ];
  }

  render({ id, author, name, year }) {
    // css in js, class name is auto generated
    const cl_book = this.css({
      color: 'red',
      '&:focus': {
        'background-color': 'orange'
      }
    });
    // manual create css class name
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

comp.$compile(); // return html

comp.getCompCssAsString(); // return css: <style>.a{color:red;}.a:focus{background-color:orange;}.list-book__author{text-transform:capitalize;}.list-book__name{font-size: 16px}</style>

const { head, js } = comp.getCompJsAsString(); // js code for <head> and before </body>

```

If you don't want manually building html page you can using special class `IgnisPage` which collecting html code of components and inserting all of needed css and js code.
```js
const { IgnisPage } = require('@ignis-web/server-component');

class Page extends IgnisPage {

  body(books) {
    return this.t`
      <div class="columns">
        <div class=column>
          ${new ListBook(books)}
        </div>
      </div>
    `;
  }

}

const htmlPage = new Page([
  { id: 1, author: 'Leo Tolstoy', name: 'War and Peace', year: 1863 },
  { id: 2, author: 'Jack London', name: 'White Fang', year: 1906 }
]).render();
console.log(htmlPage); // <!DOCTYPE html><html lang=\"EN\"><head><title>....</body></html>
```


### IgnisComp
```js
class Book extends IgnisComp {

  headJs() {
    return [
      this.script('/assets/book.js'),
    ];
  }

  js() {
    return [
      'console.log("I will be executed in the footer!")',
    ];
  }


  render({ id, author, name, year }) {
    return this.t`
      <div>
        <p class=list-book__name>Name: ${name}</p>
        <p>Author: ${author}</p>
        <p>Year: ${new BookYear(year)}</p
      </div>
    `;
  }
}
```
`render()` is a single required method.

* `headJs()` - this method is intended for declaration javascript for all specific type components (in this case for all components of "Book" type). Tags `<script>` will be placed in `<head></head>`
* `js()` - this method is similar to `headJS()`, but tags `<script>` will be placed before tag `<body>` close

```js
class Book extends IgnisComp {
  headJs() {
    const ids = this.getSharedData('ids');
    return [
      this.script('/assets/book.js'),
      `[${ids.join(',')}].forEach(id => new Book(id);`
    ];
  }

  render({ id, author, name, year }) {
    const ids = this.getSharedData('ids', []);
    ids.push(id);
    this.setSharedData('ids', ids);

    return this.t`
      <div>
        <p class=list-book__name>Name: ${name}</p>
        <p>Author: ${author}</p>
        <p>Year: ${new BookYear(year)}</p
      </div>
    `;
  }
}
```

*  `this.setSharedData(key, value)` - We can store shared data for specific type components (in this case for all components of "Book" type), which were used on the html page. For example, we save id of books and get them in declaration of javascript code for using in our business logic.
*  `this.getSharedData(key, defaultValue)` - We get shared data by key. Second argument is fallback if value doesn't exist yet.

### CSS in JS
```js
class Book extends IgnisComp {

  render({ id, author, name, year }) {
    // Create css class as css in js. Class name is generated automatically
    const cl_book = this.css({
      color: 'red',
      // properties as camel case
      fontSize: '12px',
      '&:focus': {
        // properties as kebab case
        'background-color': 'orange'
      }
    });

    // Create css class as css in js, but use specific class name
    const cl_author = this.css('list-book__author', {
      textTransform: 'capitalize'
    });

    // Create css class as string. Class name is generated automatically
    this.css('.list-book__name{font-size: 16px}');

    return this.t`
      <div class=${cl_book}>
        <p class=list-book__name>Name: ${name}</p>
        <p class=${cl_author}>Author: ${author}</p>
        <p>Year: ${new BookYear(year)}</p
      </div>
    `;
  }
}
```
##### Note:
You shouldn't create css inside block if/else statement:
```js
  if (Math.random() > 0.5) {
    const cl_author = this.css('list-book__author', {
      textTransform: 'capitalize'
    });
  }
```
**It will not work!**


#### Tpl
```js
class BookYear extends IgnisComp {

  render(year) {
    const cl_early_year = this.css({ color: 'green' });
    const cl_middle_year = this.css({ color: 'orange' });
    const cl_late_year = this.css({ color: 'blue' });

    return this.t`
      ${this.tpl
        .if(year < 1600, () => this.t`<span class=${cl_early_year}>${year}</span>`)
        .else_if(year > 1600 && year > 1900, () => this.t`<span class=${cl_middle_year}>${year}</span>`)
        .else(this.t`<span class=${cl_late_year}>${year}</span>`)
      }
    `;
  }
}
```
`this.tpl` - tpl is an embedded library for convenient work with conditions in template. [Show docs](https://www.npmjs.com/package/@ignis-web/tpl).


#### Script and Link

```js
this.cssLink('https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma-rtl.min.css')
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma-rtl.min.css"/>
```
Method `this.cssLink` is used for convenient creation of tag `<link>`.

```js
this.script('https://cdnjs.cloudflare.com/ajax/libs/highcharts/9.3.2/highcharts.js')
  .async()
  .onload('console.log("Highcharts is loading");')
```
Method `this.script` is used for convenient creation of tag `<script>`.
* `this.script(src?)` - to create tag with link. Src is optional
* `async()` - to add attribute `async`
* `defer()` - to add attribute `defer`
* `onload(string)` - to add attribute `onload` with passed js code
* `code(string)` - to add js code inside `<script></script>`


### IgnisPage
`IgnisPage` is a basic component for creation of html page which contains components based on `IgnisComp`.
```js
class Page extends IgnisPage {

  // set true, if you want remove spaces, comments from final html and css
  minify() {
    return false;
  }

  // if you want change default <html>
  htmlTag() {
    return '<html lang="EN">';
  }

  // if you want replacement tags, favicon and etc
  head() {
    return [
      '<meta charset="UTF-8">',
      '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    ];
  }

  // for set <title>
  title() {
    return 'Hello, I am page with IgnisComponent !';
  }

  // for set metag description
  description() {
    return '';
  }

  // for set metag keywords
  keywords() {
    return '';
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
        </div>
      </div>
    `;
  }
}

// Render page
const html = new Page([
  { id: 1, author: 'Leo Tolstoy', name: 'War and Peace', year: 1863 },
  { id: 2, author: 'Jack London', name: 'White Fang', year: 1906 }
]).render();

console.log(html);
```

### Example
An example of rendering a html page with a list of books, where most of the features are demonstrated.
```js
'use strict';

// IgnisComp - for standard component, IgnisPage - for render whole html page
const { IgnisComp, IgnisPage } = require('@ignis-web/server-component');

// Component
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
      'console.log("I will be executed in the footer!")',
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
    // create class as simple string
    this.css('.list-book__name{font-size: 16px}');

    // You can store shared data for specific type components(in this case Book)  which were used on page
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

  render(year) {
    const cl_early_year = this.css({ color: 'green' });

    const cl_middle_year = this.css({ color: 'orange' });

    const cl_late_year = this.css({ color: 'blue' });

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

// Component for render whole web page
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
      'console.log("I will be executed in the footer!");',
    ];
  }

  // It will be place in <body></body>
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

// Render page
const html = new Page([
  { id: 1, author: 'Leo Tolstoy', name: 'War and Peace', year: 1863 },
  { id: 2, author: 'Jack London', name: 'White Fang', year: 1906 }
]).render();

console.log(html);

```