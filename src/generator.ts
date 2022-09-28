
import GenCssIdentifier from '@ignis-web/gen-css-identifier';

const options = { notStartsWith: '0123456789' };
const genClassName = new GenCssIdentifier('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', options).except(['ga']);
const genId = new GenCssIdentifier('ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba0123456789', options).except(['ga']);

export interface I_gen_css_identifier { next: () => string };

export default {
  forClass(): I_gen_css_identifier {
    return genClassName;
  },
  forId(): I_gen_css_identifier {
    return genId;
  }
};