import 'media-chrome';
import './media-control-strip.js';
import './media-playback-rate-range-button.js';
import './media-playback-rate-range.js';
import { html, render } from '@github/jtml';

const template = html`
  <style>
    :host {
      --white: rgba(253, 244, 255, 1);
      color: var(--white);
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      --media-control-background: rgba(23, 35, 35, 0.8);
      --media-control-hover-background: rgba(23, 35, 35, 0.8);
      --media-icon-color: var(--white);
    }

    media-airplay-button[media-airplay-unavailable],
    media-volume-range[media-volume-unavailable],
    media-pip-button[media-pip-unavailable] {
      display: none;
    }

    media-controller {
      --media-aspect-ratio: auto;
      display: block;
      width: 100%;
      height: 100%;
    }

    media-play-button {
      width: 90px;
      aspect-ratio: 16 / 10;
      border-radius: 6px;
      --media-control-background: rgba(0, 171, 245, 0.75);
      --media-control-hover-background: rgba(0, 171, 245, 0.9);
      --media-button-icon-transform: scale(1.1);
    }

    media-control-bar {
      position: relative;
      height: 50px;
    }

    media-control-bar svg {
      fill: none;
      transition: transform .2s ease;
      transform: scale(1.001);
    }

    media-control-bar svg:active {
      transform: scale(1.2);
    }

    media-captions-button svg {
      fill: var(--white);
      transform: scale(0.97);
    }

    media-time-range {
      width: 100%;
      height: 10px;
      padding: 0;
      position: absolute;
      bottom: 47px;
      z-index: 99;
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      --media-range-track-background-color: rgba(253, 244, 255, 0.5);
      --media-range-bar-color: rgba(0, 171, 245, 0.8);
      --media-range-thumb-background: var(--white);
      --media-range-thumb-width: 0px;
      --media-range-thumb-height: 0px;
      --media-range-track-height: 4px;
      --media-range-track-transition: height 0.2s ease;
    }

    media-time-range:hover {
      --media-range-track-height: 4px;
      --media-range-thumb-width: 10px;
      --media-range-thumb-height: 10px;
    }

    media-playback-rate-range,
    media-volume-range {
      height: 50px;
    }

    .spacer {
      flex-grow: 1;
      height: 100%;
      background-color: var(--media-control-background, rgba(20, 20, 30, 0.7));
    }
  </style>

  <media-controller>
    <slot name="media" slot="media"></slot>

    <div slot="centered-chrome">
      <media-play-button>
        <svg
          slot="play"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M7 4v16l13 -8z"></path>
        </svg>
        <svg
          slot="pause"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <rect x="6" y="5" width="4" height="14" rx="0"></rect>
          <rect x="14" y="5" width="4" height="14" rx="0"></rect>
        </svg>
      </media-play-button>
    </div>

    <media-time-range></media-time-range>
    <media-control-bar>
      <media-time-display show-duration remaining></media-time-display>
      <div class="spacer"></div>
      <media-captions-button>
        <svg aria-hidden="true" viewBox="0 0 20 18" slot="on">
          <path
            d="M19.83 2.68a2.58 2.58 0 0 0-2.3-2.5C13.91-.06 6.09-.06 2.47.18a2.58 2.58 0 0 0-2.3 2.5 115.86 115.86 0 0 0 0 12.64 2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5 115.86 115.86 0 0 0 0-12.64ZM8.42 12.78a3.63 3.63 0 0 1-1.51.32 4.76 4.76 0 0 1-1.63-.27A4 4 0 0 1 4 12a3.67 3.67 0 0 1-.84-1.26 4.23 4.23 0 0 1-.3-1.63 4.28 4.28 0 0 1 .3-1.64A3.53 3.53 0 0 1 4 6.26a3.89 3.89 0 0 1 1.29-.8 4.76 4.76 0 0 1 1.63-.27 4.06 4.06 0 0 1 .67.06 4.57 4.57 0 0 1 .68.18 3.59 3.59 0 0 1 .64.34 2.7 2.7 0 0 1 .55.52l-1.27 1a1.79 1.79 0 0 0-.6-.46 2 2 0 0 0-.83-.16 2 2 0 0 0-1.56.69 2.35 2.35 0 0 0-.46.77 2.78 2.78 0 0 0-.16 1 2.74 2.74 0 0 0 .16 1 2.39 2.39 0 0 0 .46.77 2.07 2.07 0 0 0 .67.5 2 2 0 0 0 .84.18 1.87 1.87 0 0 0 .9-.21 1.78 1.78 0 0 0 .65-.6l1.38 1a2.88 2.88 0 0 1-1.22 1.01Zm7.52 0a3.63 3.63 0 0 1-1.51.32 4.76 4.76 0 0 1-1.63-.27 3.89 3.89 0 0 1-1.28-.83 3.55 3.55 0 0 1-.85-1.26 4.23 4.23 0 0 1-.3-1.63 4.28 4.28 0 0 1 .3-1.64 3.43 3.43 0 0 1 .85-1.25 3.75 3.75 0 0 1 1.28-.8 4.76 4.76 0 0 1 1.63-.27 4 4 0 0 1 .67.06 4.27 4.27 0 0 1 .68.18 3.59 3.59 0 0 1 .64.34 2.46 2.46 0 0 1 .55.52l-1.27 1a1.79 1.79 0 0 0-.6-.46 2 2 0 0 0-.83-.16 2 2 0 0 0-1.56.69 2.35 2.35 0 0 0-.46.77 3 3 0 0 0-.16 1 3 3 0 0 0 .16 1 2.58 2.58 0 0 0 .46.77 2.07 2.07 0 0 0 .67.5 2 2 0 0 0 .84.18 1.87 1.87 0 0 0 .9-.21 1.78 1.78 0 0 0 .65-.6l1.38 1a2.82 2.82 0 0 1-1.21 1.05Z"
          />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 20 18" slot="off">
          <path
            d="M19.83 2.68a2.58 2.58 0 0 0-2.3-2.5C15.72.06 12.86 0 10 0S4.28.06 2.47.18a2.58 2.58 0 0 0-2.3 2.5 115.86 115.86 0 0 0 0 12.64 2.58 2.58 0 0 0 2.3 2.5c1.81.12 4.67.18 7.53.18s5.72-.06 7.53-.18a2.58 2.58 0 0 0 2.3-2.5 115.86 115.86 0 0 0 0-12.64Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18s-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11 122.5 122.5 0 0 1 0-12.42 1.11 1.11 0 0 1 .91-1.11C4.24 1.57 7 1.5 10 1.5s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11 122.5 122.5 0 0 1 0 12.42ZM7.84 11a1.55 1.55 0 0 1-.76.18 1.57 1.57 0 0 1-.71-.18 1.69 1.69 0 0 1-.57-.42 2.1 2.1 0 0 1-.38-.58 2.47 2.47 0 0 1 0-1.64 2 2 0 0 1 .39-.66 1.73 1.73 0 0 1 .58-.42 1.81 1.81 0 0 1 .73-.16 1.68 1.68 0 0 1 .7.14 1.39 1.39 0 0 1 .51.39l1.08-.89a2.18 2.18 0 0 0-.47-.44A2.81 2.81 0 0 0 8.4 6a2.91 2.91 0 0 0-.58-.15 2.71 2.71 0 0 0-.56 0A4.08 4.08 0 0 0 5.88 6a3.27 3.27 0 0 0-1.09.67 3.14 3.14 0 0 0-.71 1.06 3.62 3.62 0 0 0-.26 1.39 3.57 3.57 0 0 0 .26 1.38 3 3 0 0 0 .71 1.06 3.27 3.27 0 0 0 1.09.67 3.85 3.85 0 0 0 1.38.23 3.2 3.2 0 0 0 1.28-.27 2.49 2.49 0 0 0 1-.83l-1.17-.88a1.42 1.42 0 0 1-.53.52Zm6.62 0a1.58 1.58 0 0 1-.76.18A1.54 1.54 0 0 1 13 11a1.69 1.69 0 0 1-.57-.42A2.12 2.12 0 0 1 12 10a2.29 2.29 0 0 1 .39-2.3 1.84 1.84 0 0 1 1.32-.58 1.71 1.71 0 0 1 .7.14 1.39 1.39 0 0 1 .51.39L16 6.73a2.43 2.43 0 0 0-.47-.44A3.22 3.22 0 0 0 15 6a3 3 0 0 0-.57-.15 2.87 2.87 0 0 0-.57 0A4.06 4.06 0 0 0 12.5 6a3.17 3.17 0 0 0-1.09.67 3 3 0 0 0-.72 1.06 3.62 3.62 0 0 0-.25 1.39 3.57 3.57 0 0 0 .25 1.38 2.93 2.93 0 0 0 .72 1.06 3.17 3.17 0 0 0 1.09.67 3.83 3.83 0 0 0 1.37.23 3.16 3.16 0 0 0 1.28-.27 2.45 2.45 0 0 0 1-.83L15 10.51a1.49 1.49 0 0 1-.54.49Z"
          />
        </svg>
      </media-captions-button>
      <media-control-strip>
        <media-volume-range></media-volume-range>
        <media-mute-button slot="open-button">
          <svg
            slot="high"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15 8a5 5 0 0 1 0 8"></path>
            <path d="M17.7 5a9 9 0 0 1 0 14"></path>
            <path
              d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a0.8 .8 0 0 1 1.5 .5v14a0.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
              fill="currentColor"
            ></path>
          </svg>
          <svg
            slot="medium"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15 8a5 5 0 0 1 0 8"></path>
            <path d="M17.7 5a9 9 0 0 1 0 14"></path>
            <path
              d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a0.8 .8 0 0 1 1.5 .5v14a0.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
              fill="currentColor"
            ></path>
          </svg>
          <svg
            slot="low"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M15 8a5 5 0 0 1 0 8"></path>
            <path
              d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a0.8 .8 0 0 1 1.5 .5v14a0.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
              fill="currentColor"
            ></path>
          </svg>
          <svg
            slot="off"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a0.8 .8 0 0 1 1.5 .5v14a0.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"
            ></path>
            <path d="M16 10l4 4m0 -4l-4 4"></path>
          </svg>
        </media-mute-button>
      </media-control-strip>
      <media-control-strip>
        <media-playback-rate-range></media-playback-rate-range>
        <media-playback-rate-range-button slot="open-button">
        </media-playback-rate-range-button>
      </media-control-strip>
      <media-pip-button>
        <svg
          slot="enter"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4"
          ></path>
          <rect
            x="14"
            y="14"
            width="7"
            height="5"
            rx="1"
            fill="currentColor"
          ></rect>
          <line x1="7" y1="9" x2="11" y2="13"></line>
          <path d="M8 13h3v-3"></path>
        </svg>
        <svg
          slot="exit"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4"
          ></path>
          <rect
            x="14"
            y="14"
            width="7"
            height="5"
            rx="1"
            fill="currentColor"
          ></rect>
          <line x1="7" y1="9" x2="11" y2="13"></line>
          <path d="M7 12v-3h3"></path>
        </svg>
      </media-pip-button>
      <media-airplay-button></media-airplay-button>
      <media-fullscreen-button>
        <svg
          slot="enter"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <polyline points="16 4 20 4 20 8"></polyline>
          <line x1="14" y1="10" x2="20" y2="4"></line>
          <polyline points="8 20 4 20 4 16"></polyline>
          <line x1="4" y1="20" x2="10" y2="14"></line>
          <polyline points="16 20 20 20 20 16"></polyline>
          <line x1="14" y1="14" x2="20" y2="20"></line>
          <polyline points="8 4 4 4 4 8"></polyline>
          <line x1="4" y1="4" x2="10" y2="10"></line>
        </svg>
        <svg
          slot="exit"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <polyline points="5 9 9 9 9 5"></polyline>
          <line x1="3" y1="3" x2="9" y2="9"></line>
          <polyline points="5 15 9 15 9 19"></polyline>
          <line x1="3" y1="21" x2="9" y2="15"></line>
          <polyline points="19 9 15 9 15 5"></polyline>
          <line x1="15" y1="9" x2="21" y2="3"></line>
          <polyline points="19 15 15 15 15 19"></polyline>
          <line x1="15" y1="15" x2="21" y2="21"></line>
        </svg>
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
