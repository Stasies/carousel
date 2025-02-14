export class SlideComponent extends HTMLElement {
  rendered: boolean
  constructor() {
    super()
    this.rendered = false
  }
  connectedCallback() {
    this.render()
  }
  render() {
    if (this.rendered) return
    const wrapper = document.createElement("div");
    wrapper.classList.add("slide");

    let children = Array.from(this.childNodes)
    children.forEach((slide) => {
      wrapper.appendChild(slide.cloneNode(true))
    })

    this.replaceWith(wrapper)
    this.rendered = true
  }
}