import 'media-chrome';
import { html, render, unsafeHTML } from './html.js';
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

const template = (props) => html`
  <style>
    ${cssStr}
  </style>

  <media-controller class="${props.breakpoints}">
    <slot name="media" slot="media"></slot>

    <div slot="centered-chrome" class="xs:hidden">
      <media-play-button>
        ${unsafeHTML(play)} ${unsafeHTML(pause)}
      </media-play-button>
    </div>

    <div class="neo-control-bar">
      <media-play-button class="hidden xs:block">
        ${unsafeHTML(play)} ${unsafeHTML(pause)}
      </media-play-button>

      <div class="neo-play-bar">
        <media-time-range class="mobile sm:hidden xs:rounded-t-sm"></media-time-range>
        <media-control-bar class="xs:rounded-b-sm sm:rounded-t-sm">
          <media-time-display show-duration class="hidden xs:inline-flex"></media-time-display>
          <media-time-range class="desktop hidden sm:block"></media-time-range>
          <div class="spacer"></div>
          <media-captions-button>
            ${unsafeHTML(captionsOn)} ${unsafeHTML(captionsOff)}
          </media-captions-button>
          <media-control-strip vertical>
            <media-volume-range></media-volume-range>
            <media-mute-button slot="open-button">
              ${unsafeHTML(volumeHigh)} ${unsafeHTML(volumeMedium)}
              ${unsafeHTML(volumeLow)} ${unsafeHTML(volumeOff)}
            </media-mute-button>
          </media-control-strip>
          <media-control-strip vertical>
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
      </div>
    </div>
  </media-controller>
`;

const resizeObserver = new ResizeObserver(function(entries) {
  entries.forEach(({ target }) => target.render());
});

class MediaThemeNeo extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.render();

    resizeObserver.observe(this);
  }

  render() {
    render(template({
      breakpoints: getBreakpoints(this)
    }), this.shadowRoot);
  }

  hotReplacedCallback() {
    console.log('Hot cakes incoming!');
    this.render();
  }

  get breakpoints() {
    return { xs: 396, sm: 484, md: 576, lg: 768, xl: 960 };
  }
}

function getBreakpoints(el) {
  return Object.keys(el.breakpoints).filter(key => {
    return el.offsetWidth >= el.breakpoints[key];
  });
}

if (!customElements.get('media-theme-neo')) {
  customElements.define('media-theme-neo', MediaThemeNeo);
}

export { MediaThemeNeo };
