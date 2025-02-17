export class SlideComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("slide");

    let children = Array.from(this.children);
    children.forEach((slide) => {
      wrapper.appendChild(slide.cloneNode(true));
    });

    this.replaceWith(wrapper);
  }
}
