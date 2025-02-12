import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("slide-component")
export class Slide extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      flex: 0 0 auto;
      box-sizing: border-box;
    }
  `;
  @property({ type: String }) status = "";
  constructor() {
    super()
  }
  render() {
    return html`
      <div class="slide ${this.status ? 'carousel-slide_' + this.status : ''}">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "slide-component": Slide;
  }
}
