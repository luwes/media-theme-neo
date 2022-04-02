import { html, render, unsafeHTML } from '@github/jtml';
import 'media-chrome';
import './media-control-strip.js';
import './media-playback-rate-range-button.js';
import './media-playback-rate-range.js';
import cssStr from './styles.css';
import play from './icons/play.svg';
import pause from './icons/pause.svg';
import captionsOn from './icons/captions-on.svg';
import captionsOff from './icons/captions-off.svg';
import fullscreenEnter from './icons/fullscreen-enter.svg';
import fullscreenExit from './icons/fullscreen-exit.svg';
import pipEnter from './icons/pip-enter.svg';
import pipExit from './icons/pip-exit.svg';
import volumeOff from './icons/volume-off.svg';
import volumeLow from './icons/volume-low.svg';
import volumeMedium from './icons/volume-medium.svg';
import volumeHigh from './icons/volume-high.svg';

const template = html`
  <style>
    ${cssStr}
  </style>

  <media-controller>
    <slot name="media" slot="media"></slot>

    <div slot="centered-chrome">
      <media-play-button>
        ${unsafeHTML(play)} ${unsafeHTML(pause)}
      </media-play-button>
    </div>

    <media-time-range></media-time-range>
    <media-control-bar>
      <media-time-display show-duration remaining></media-time-display>
      <div class="spacer"></div>
      <media-captions-button>
        ${unsafeHTML(captionsOn)} ${unsafeHTML(captionsOff)}
      </media-captions-button>
      <media-control-strip>
        <media-volume-range></media-volume-range>
        <media-mute-button slot="open-button">
          ${unsafeHTML(volumeHigh)} ${unsafeHTML(volumeMedium)}
          ${unsafeHTML(volumeLow)} ${unsafeHTML(volumeOff)}
        </media-mute-button>
      </media-control-strip>
      <media-control-strip>
        <media-playback-rate-range></media-playback-rate-range>
        <media-playback-rate-range-button slot="open-button">
        </media-playback-rate-range-button>
      </media-control-strip>
      <media-pip-button>
        ${unsafeHTML(pipEnter)} ${unsafeHTML(pipExit)}
      </media-pip-button>
      <media-airplay-button></media-airplay-button>
      <media-fullscreen-button>
        ${unsafeHTML(fullscreenEnter)} ${unsafeHTML(fullscreenExit)}
      </media-fullscreen-button>
    </media-control-bar>
  </media-controller>
`;

class MediaThemeNeo extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    render(template, this.shadowRoot);
  }
}

if (!customElements.get('media-theme-neo')) {
  customElements.define('media-theme-neo', MediaThemeNeo);
}

export default MediaThemeNeo;
