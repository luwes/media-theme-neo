import { Window as window, defineCustomElement } from './utils.js';
import { MediaChromeRange, constants } from 'media-chrome';

const { MediaUIEvents, MediaUIAttributes } = constants;

class MediaPlaybackRateRange extends MediaChromeRange {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_PLAYBACK_RATE,
    ];
  }

  constructor() {
    super();

    this.range.step = 0.25;
    this.range.min = 0.25;
    this.range.max = 2;

    this.range.addEventListener('input', () => {
      const detail = this.range.value;
      const evt = new window.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, {
        composed: true,
        bubbles: true,
        detail,
      });
      this.dispatchEvent(evt);
    });
  }

  connectedCallback() {
    this.range.setAttribute('aria-label', 'playback rate');
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      attrName === MediaUIAttributes.MEDIA_PLAYBACK_RATE
    ) {
      this.range.value = +(this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE));
      this.range.setAttribute(
        'aria-valuetext',
        this.getAttribute(MediaUIAttributes.MEDIA_PLAYBACK_RATE)
      );
      this.updateBar();
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }
}

defineCustomElement('media-playback-rate-range', MediaPlaybackRateRange);

export default MediaPlaybackRateRange;
