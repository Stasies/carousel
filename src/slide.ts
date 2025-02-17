export class SlideComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.classList.add("slide");

    const style = document.createElement("style");
    style.textContent = `
    .slide{
      height: 100%;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: block;
    }
    `;
    document.head.appendChild(style);
  }
}
