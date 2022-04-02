import { MediaChromeButton, constants } from 'media-chrome';
import { Window as window, Document as document, defineCustomElement } from './utils.js';

const { MediaUIEvents, MediaUIAttributes } = constants;
const { MEDIA_PLAYBACK_RATE } = MediaUIAttributes;

const lowIcon =
  `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <circle cx="12" cy="13" r="2"></circle>
   <line x1="13.45" y1="11.55" x2="15.5" y2="9.5"></line>
   <path d="M6.4 20a9 9 0 1 1 11.2 0z"></path>
</svg>`;

const mediumIcon =
  `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <circle cx="12" cy="13" r="2"></circle>
   <line x1="13.45" y1="11.55" x2="15.5" y2="9.5"></line>
   <path d="M6.4 20a9 9 0 1 1 11.2 0z"></path>
</svg>`;

const highIcon =
  `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <circle cx="12" cy="13" r="2"></circle>
   <line x1="13.45" y1="11.55" x2="15.5" y2="9.5"></line>
   <path d="M6.4 20a9 9 0 1 1 11.2 0z"></path>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  svg {
    fill: none;
  }

  /* Default to Medium slot/icon. */
  :host(:not([${MEDIA_PLAYBACK_RATE}])) slot:not([name=medium]) > *,
  :host(:not([${MEDIA_PLAYBACK_RATE}])) ::slotted(:not([slot=medium])),
  :host([${MEDIA_PLAYBACK_RATE}="0.75"]) slot:not([name=medium]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="0.75"]) ::slotted(:not([slot=medium])),
  :host([${MEDIA_PLAYBACK_RATE}="1"]) slot:not([name=medium]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="1"]) ::slotted(:not([slot=medium])),
  :host([${MEDIA_PLAYBACK_RATE}="1.25"]) slot:not([name=medium]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="1.25"]) ::slotted(:not([slot=medium])) {
    display: none;
  }

  :host([${MEDIA_PLAYBACK_RATE}="0.25"]) slot:not([name=low]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="0.25"]) ::slotted(:not([slot=low])),
  :host([${MEDIA_PLAYBACK_RATE}="0.5"]) slot:not([name=low]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="0.5"]) ::slotted(:not([slot=low])) {
    display: none;
  }

  :host([${MEDIA_PLAYBACK_RATE}="1.5"]) slot:not([name=high]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="1.5"]) ::slotted(:not([slot=high])),
  :host([${MEDIA_PLAYBACK_RATE}="1.75"]) slot:not([name=high]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="1.75"]) ::slotted(:not([slot=high])),
  :host([${MEDIA_PLAYBACK_RATE}="2"]) slot:not([name=high]) > *,
  :host([${MEDIA_PLAYBACK_RATE}="2"]) ::slotted(:not([slot=high])) {
    display: none;
  }
  </style>

  <slot name="low">${lowIcon}</slot>
  <slot name="medium">${mediumIcon}</slot>
  <slot name="high">${highIcon}</slot>
`;

class MediaPlaybackRateRangeButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MEDIA_PLAYBACK_RATE];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  handleClick() {
    this.dispatchEvent(
      new window.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, {
        composed: true,
        bubbles: true,
        detail: 1,
      })
    );
  }
}

defineCustomElement(
  'media-playback-rate-range-button',
  MediaPlaybackRateRangeButton
);

export default MediaPlaybackRateRangeButton;
