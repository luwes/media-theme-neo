import { MediaChromeButton, constants } from 'https://cdn.jsdelivr.net/npm/media-chrome@0.16/+esm';

const { MediaUIEvents, MediaUIAttributes } = constants;
const { MEDIA_PLAYBACK_RATE } = MediaUIAttributes;

/*
  <media-playback-rate-range-button rates="1 1.5 2">
*/

const DEFAULT_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
const DEFAULT_RATE = 1;

const slowIcon = `<svg fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 11.55L8.45 9.5M6.4 20a9 9 0 1111.2 0H6.4z"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14a1 1 0 100-2 1 1 0 000 2z"/>
  <path stroke="currentColor" stroke-linecap="round" d="M9.505 7.5l-1.25-2.75m-1.75 5.5l-2.75-1.375m2.5 5.375l-2.875.625M14.5 7.5l1.25-2.75m1.75 5.5l2.75-1.375m-2.5 5.375l2.875.625"/>
</svg>`;

const normalIcon = `<svg fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14a1 1 0 100-2 1 1 0 000 2z"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.4 20a9 9 0 1111.2 0H6.4z"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 9v4"/>
  <path stroke="currentColor" stroke-linecap="round" d="M9.5 7.5L8.25 4.75m-1.75 5.5L3.75 8.875m2.5 5.375l-2.875.625M14.495 7.5l1.25-2.75m1.75 5.5l2.75-1.375m-2.5 5.375l2.875.625"/>
</svg>`;

const fastIcon = `<svg fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.603 13.323L15.5 9.5M6.4 20a9 9 0 1111.2 0H6.4z"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14a1 1 0 100-2 1 1 0 000 2z"/>
  <path stroke="currentColor" stroke-linecap="round" d="M9.505 7.5l-1.25-2.75m-1.75 5.5l-2.75-1.375m2.5 5.375l-2.875.625M14.5 7.5l1.25-2.75m1.75 5.5l2.75-1.375m-2.5 5.375l2.875.625"/>
</svg>`;

const fasterIcon = `<svg fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12.977L17 12M6.4 20a9 9 0 1111.2 0H6.4z"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14a1 1 0 100-2 1 1 0 000 2z"/>
  <path stroke="currentColor" stroke-linecap="round" d="M9.505 7.5l-1.25-2.75m-1.75 5.5l-2.75-1.375m2.5 5.375l-2.875.625M14.5 7.5l1.25-2.75m1.75 5.5l2.75-1.375m-2.5 5.375l2.875.625"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  svg {
    fill: none;
  }

  /* TODO: maybe add to Media Chrome for icon transform on click */
  svg:active, img:active, ::slotted(svg:active), ::slotted(img:active) {
    transform: var(--media-button-icon-active-transform);
  }

  /* Default to Medium slot/icon. */
  :host(:not([${MEDIA_PLAYBACK_RATE}])) slot:not([name="rate-1"]) > *,
  :host(:not([${MEDIA_PLAYBACK_RATE}])) ::slotted(:not([slot="rate-1"])) {
    display: none;
  }
  </style>
`;

class MediaPlaybackRateRangeButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MEDIA_PLAYBACK_RATE];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });

    const sheet = this.shadowRoot.querySelector('style').sheet;

    for (let i = 0; i < this.rates.length; i++) {
      const rate = this.rates[i];
      const css = `
        :host([${MEDIA_PLAYBACK_RATE}="${rate}"]) slot:not([name="rate-${rate}"]) > *,
        :host([${MEDIA_PLAYBACK_RATE}="${rate}"]) ::slotted(:not([slot="rate-${rate}"])) {
          display: none;
        }
      `;
      sheet.insertRule(css, sheet.cssRules.length);

      const slot = document.createElement('slot');
      slot.name = `rate-${rate}`;

      if (rate === 1) {
        slot.innerHTML = normalIcon;
      } else if (rate < 1) {
        slot.innerHTML = slowIcon;
      } else if (rate >= 1.5) {
        slot.innerHTML = fasterIcon;
      } else if (rate > 1) {
        slot.innerHTML = fastIcon;
      }

      this.shadowRoot.append(slot);
    }
  }

  get rates() {
    if (!this.getAttribute('rates')) return DEFAULT_RATES;

    return this.getAttribute('rates')
      .trim()
      .split(/\s*,?\s+/)
      .map((str) => Number(str))
      .filter((num) => !Number.isNaN(num));
  }

  handleClick() {
    const currentRate =
      +this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE) || DEFAULT_RATE;
    const detail =
      this.rates.find((r) => r > currentRate) ?? this.rates[0] ?? DEFAULT_RATE;
    this.dispatchEvent(
      new window.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, {
        composed: true,
        bubbles: true,
        detail,
      })
    );
  }
}

if (!globalThis.customElements.get('media-playback-rate-range-button')) {
  globalThis.customElements.define('media-playback-rate-range-button', MediaPlaybackRateRangeButton);
}

export default MediaPlaybackRateRangeButton;
