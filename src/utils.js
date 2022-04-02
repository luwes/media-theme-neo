const windowShim = {
  HTMLElement: function HTMLElement() {
    this.addEventListener = () => {};
    this.removeEventListener = () => {};
    this.dispatchEvent = () => {};
  },
  customElements: {
    get: function () {},
    define: function () {},
    whenDefined: function () {},
  },
  CustomEvent: function CustomEvent() {},
};

const documentShim = {
  createElement: function () {
    return new windowShim.HTMLElement();
  },
};

export const isServer =
  typeof window === 'undefined' || typeof window.customElements === 'undefined';
export const Window = isServer ? windowShim : window;
export const Document = isServer ? documentShim : window.document;

export function defineCustomElement(name, element) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, element);
    window[element.name] = element;
  }
}
