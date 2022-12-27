import { MediaChromeRange, constants } from 'https://cdn.jsdelivr.net/npm/media-chrome@0.16/+esm';

const { MediaUIEvents, MediaUIAttributes } = constants;

/*
  <media-playback-rate-range rates="1 1.5 2">
*/

const DEFAULT_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
const DEFAULT_RATE = 1;

class MediaPlaybackRateRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
      'rates',
    ];
  }

  constructor() {
    super();

    this.range.step = 1;
    this.range.min = 0;
    this.range.max = this.rates.length - 1;

    this.range.addEventListener('input', () => {
      const detail = this.rates[this.range.value];
      const evt = new window.CustomEvent(
        MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST,
        {
          composed: true,
          bubbles: true,
          detail,
        }
      );
      this.dispatchEvent(evt);
    });
  }

  connectedCallback() {
    this.range.setAttribute('aria-label', 'playback rate');
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE) {
      let newRate = +newValue;
      if (Number.isNaN(newRate)) {
        newRate = DEFAULT_RATE;
      }

      this.range.value = this.rates.indexOf(newRate);
      this.range.setAttribute(
        'aria-valuetext',
        this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE)
      );
      this.updateBar();
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  get rates() {
    if (!this.getAttribute('rates')) return DEFAULT_RATES;

    return this.getAttribute('rates')
      .trim()
      .split(/\s*,?\s+/)
      .map((str) => Number(str))
      .filter((num) => !Number.isNaN(num));
  }
}

if (!globalThis.customElements.get('media-playback-rate-range')) {
  globalThis.customElements.define('media-playback-rate-range', MediaPlaybackRateRange);
}

export default MediaPlaybackRateRange;
