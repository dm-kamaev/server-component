import IgnisComp from './IgnisComp';
import Minify from './Minify';


export default class CompToTurboHtml {
  t: (statics: any, ...variables: any[]) => string;
  css: (...arg: any[]) => any;
  cssLink: (href: string) => ReturnType<IgnisComp<any>['cssLink']>;
  link: (href: string) => ReturnType<IgnisComp<any>['link']>;
  script: (src: string) => ReturnType<IgnisComp<any>['script']>;
  createId: () => string;
  createClassName: () => string;
  tpl: any;
  _minify: Minify;

  static render(id: string, get_comp: () => IgnisComp<any>) {
    return new CompToTurboHtml(id, get_comp).render();
  }

  constructor(private _id: string, private _get_comp: () => IgnisComp<any>) {
    const root = new IgnisComp({}).makeRoot({
      ...this.generators(),
    });
    this.t = root.t.bind(root);
    this.css = root.css.bind(root);
    this.cssLink = root.cssLink.bind(root);
    this.link = root.link.bind(root);
    this.script = root.script.bind(root);
    this.createId = root.createId.bind(root);
    this.createClassName = root.createClassName.bind(root);

    this.tpl = root.tpl;

    this._minify = new Minify(this.minify());

  }


  protected generators() {
    return {
      generatorClassName: null,
      generatorId: null,
    };
  }


  protected minify() {
    return false;
  }


  render() {
    const comp = this._get_comp();
    const body = this.t`${comp}`;

    const style = comp.getCompCssAsString();
    const { head, js } = comp.getCompJsAsString();

    return { id: this._id, html: this._minify.html(body), css: this._minify.style(style), js: head+js };
  }
};

