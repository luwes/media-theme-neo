/**
 * <media-control-strip>
 * Expand or collapse some or all controls.
 * @see https://en.wikipedia.org/wiki/Control_Strip
 */
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: flex;
      z-index: 100;
    }

    .strip {
      overflow: hidden;
      box-sizing: border-box;
      background: var(--media-control-strip-background, var(--media-control-background, rgba(20,20,30, 0.7)));
      transition: var(--media-control-strip-transition-open, width .2s cubic-bezier(0,0,0.2,1));
      border-radius: var(--media-control-strip-border-radius, 0 3px 3px 0);
    }

    :host([vertical]) .strip  {
      position: absolute;
      transform-origin: 0 0;
      transform: rotate(-90deg);
    }

    :host(:not([open])) .strip {
      width: 0;
      transition: var(--media-control-strip-transition-close, width .2s cubic-bezier(0.4,0,1,1));
    }

    :slotted {
      margin: var(--media-control-strip-padding, 5px);
    }

  </style>

  <slot name="open-button"></slot>
  <div class="strip">
    <slot></slot>
  </div>
`;

class MediaControlStrip extends HTMLElement {
  static get observedAttributes() {
    return ['media-controller', 'open', 'vertical'];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const openButtonSlot = this.shadowRoot.querySelector(
      'slot[name="open-button"]'
    );
    openButtonSlot.addEventListener(
      'slotchange',
      () => {
        const openButton = this.querySelector('[slot="open-button"]');
        if (openButton) {
          const newOpenButtonIndex =
            Array.from(this.children).indexOf(openButton) + 1;
          this.shadowRoot.insertBefore(
            this.shadowRoot.children[
            Math.min(newOpenButtonIndex, this.shadowRoot.children.length - 1)
            ],
            openButtonSlot
          );
        }
      },
      { once: true }
    );

    const slotEl = this.shadowRoot.querySelector('.strip slot');
    slotEl.addEventListener('slotchange', () => {
      let width = 0;
      slotEl.assignedElements().forEach((el) => {
        width += el.offsetWidth;
      });

      // Set to an absolute width in pixels for the slide animation.
      [...this.shadowRoot.styleSheets[0].cssRules].find((x) =>
        x.selectorText.includes('.strip')
      ).style.width = `${width}px`;
    });

    const openButtonEvent =
      this.getAttribute('open-button-event') ?? 'mouseover';
    this.shadowRoot
      .querySelector('[name="open-button"]')
      .addEventListener(openButtonEvent, () => this.setAttribute('open', ''));

    this.addEventListener('mouseleave', () => this.removeAttribute('open'));
  }
}

if (!globalThis.customElements.get('media-control-strip')) {
  globalThis.customElements.define('media-control-strip', MediaControlStrip);
}

export default MediaControlStrip;
