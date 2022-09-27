
import GenCssIdentifier from '@ignis-web/gen-css-identifier';

const genClassName = new GenCssIdentifier('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').except(['ga']);
const genId = new GenCssIdentifier('ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba').except(['ga']);

export default {
  forClass() {
    return genClassName;
  },
  forId() {
    return genId;
  }
};