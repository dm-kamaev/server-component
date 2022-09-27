
import Link from './Link';

export default class CssLink extends Link {
  constructor(href) {
    super(href);
    this.rel('stylesheet').type('text/css');
  }
};
