import { SlideComponent } from "./slide"
import { ConfigValidator } from "./validator"
export class CarouselComponent extends HTMLElement {
  slides: Element[] | null
  config: any
  _currentIndex: number
  maxIndex: number
  breakpoints?: { [key: number]: any }
  slidesToShow: number
  slideCount: number
  slidesToScroll: number
  slideWidth: number
  isDragging: boolean
  startX: number
  dragOffset: number
  interval: ReturnType<typeof setInterval> | null

  constructor(...config: any) {
    super();
    this.breakpoints = {
      0: {
        itemsToShow: 1,
        itemsToScroll: 1
      },
    }
    this.config = new Proxy(this.attributes, ConfigValidator);
    this.slides = []
    this.interval = null
    this.slideWidth = 100
    this.slideCount = 0
    this._currentIndex = 0
    this.maxIndex = 0
    this.slidesToShow = 1
    this.slidesToScroll = 1
    this.isDragging = false
    this.startX = 0
    this.dragOffset = 0
  }
  static get observedAttributes() {
    return ['autoplay', 'wrapAround', 'breakpoints'];
  }
  // attributeChangedCallback() {
  //   console.log('changes')
  // }
  get currentIndex() {
    return this._currentIndex
  }
  set currentIndex(value: number) {
    this._currentIndex = Math.min(Math.max(value, 0), this.maxIndex);
    this.#handleTranslate()
    this.#updateSlideClasses()
  }
  connectedCallback() {
    this.#setResponsiveDisplayOptions()
    this.#setupSlides()
    this.render();
    this.#setupEventListeners();
    this.#updateResponsiveSettings();
    this.#setupIndex()
  }
  disconnectedCallback() {
    this.#removeEventListeners
  }
  render() {
    if (this.querySelector(".carousel")) return;
    this.config = new Proxy(this.attributes, ConfigValidator);

    this.innerHTML = ""

    const wrapper = document.createElement("div");
    wrapper.classList.add("carousel");

    const track = document.createElement("div");
    track.classList.add("carousel-track", "transition");

    this.slides?.forEach((node) => track.appendChild(node));
    wrapper.appendChild(track);
    this.appendChild(wrapper)
  }
  #setupSlides() {
    const initialSlides = Array.from(this.children);
    this.slideCount = initialSlides.length

    const firstClones = initialSlides.slice(0, Math.floor(this.slidesToShow)).map((el) => el.cloneNode(true)) as Element[];
    const lastClones = initialSlides.slice(-Math.floor(this.slidesToShow)).map((el) => el.cloneNode(true)) as Element[];

    this.slides = this.config.wrapAround ? [...lastClones, ...initialSlides, ...firstClones] : initialSlides;
  }
  #setResponsiveDisplayOptions() {
    for (let point in this.breakpoints) {
      if (window.innerWidth >= +point) {
        this.slidesToShow = this.breakpoints[+point].itemsToShow || 1;
        this.slidesToScroll = this.breakpoints[+point].itemsToScroll || this.breakpoints[+point].itemsToShow || 1;
      }
    }
  }
  #updateResponsiveSettings() {
    this.slideWidth = 100 / this.slidesToShow;
    this.slides?.forEach((slide) => {
      (slide as any).setAttribute("style", `width: ${this.slideWidth}%`);
    });
  }
  #setupIndex() {
    this.maxIndex = this.config.wrapAround ? this.slideCount : Math.max(this.slideCount - this.slidesToShow, 0);
    this.currentIndex = this.config.wrapAround ? Math.floor(this.slidesToShow) : 0;
  }
  #setupEventListeners() {
    this.addEventListener("mousedown", this.#onDragStart);
    this.addEventListener("touchstart", this.#onDragStart, { passive: true });
    this.addEventListener("mousemove", this.#onDragMove);
    this.addEventListener("touchmove", this.#onDragMove, { passive: true });
    this.addEventListener("mouseup", this.#onDragEnd);
    this.addEventListener("mouseleave", this.#onDragEnd);
    this.addEventListener("touchend", this.#onDragEnd);

    if (!this.config.autoplay) return
    this.startAutoPlay()
    this.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.addEventListener("mouseleave", () => this.startAutoPlay());
  }
  #removeEventListeners() {
    this.removeEventListener("mousedown", this.#onDragStart);
    this.removeEventListener("touchstart", this.#onDragStart);
    this.removeEventListener("mousemove", this.#onDragMove);
    this.removeEventListener("touchmove", this.#onDragMove);
    this.removeEventListener("mouseup", this.#onDragEnd);
    this.removeEventListener("mouseleave", this.#onDragEnd);
    this.removeEventListener("touchend", this.#onDragEnd);
  }
  #onDragStart(e: MouseEvent | TouchEvent) {
    this.stopAutoPlay();
    this.slidesToScroll = 1
    this.isDragging = true;
    this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.dragOffset = 0;
  }
  #onDragMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const currentX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    this.dragOffset = currentX - this.startX;
    if (this.currentIndex >= this.maxIndex && this.dragOffset < 0 || this.currentIndex <= 0 && this.dragOffset > 0) {
      this.dragOffset = 0
    }
    const track = this.querySelector(".carousel-track") as HTMLElement;
    if (track) {
      track.style.transform = `translateX(calc(-${this.currentIndex * this.slideWidth}% + ${this.dragOffset}px))`;
    }
  }
  #onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const threshold = this.slideWidth / 3;
    if (Math.abs(this.dragOffset) > threshold) {
      if (this.dragOffset < 0) {
        this.next();
      } else if (this.currentIndex > 0) {
        this.prev();
      }
    }
  }
  startAutoPlay() {
    if (this.config.autoplay) {
      this.interval = setInterval(() => this.next(), this.config.autoplay);
    }
  }
  stopAutoPlay() {
    clearInterval(this.interval!);
  }
  #handleTranslate() {
    let track = this.querySelector('.carousel-track') as HTMLDivElement
    track.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`
  }
  #updateSlideClasses() {
    this.slides?.forEach((slide, index) => {
      if (!(slide instanceof HTMLElement)) return;
      slide.classList.remove('prev', 'current', 'next', 'hidden')
      if (index === this.currentIndex) {
        slide.classList.add("current")
      } else if (index === this.currentIndex - 1) {
        slide.classList.add("prev")
      } else if (index === this.currentIndex + 1) {
        slide.classList.add("next")
      } else if (index < this.currentIndex - 1 || index > this.currentIndex + this.slidesToShow) {
        slide.classList.add('hidden')
      }
    });
  }
  handleNonInfiniteScroll(step: number) {
    this.currentIndex += step
    if (this.maxIndex == this.currentIndex) {
      this.stopAutoPlay()
    }
  }
  #resetScroll(indexVal: number) {
    let track = this.querySelector('.carousel-track')
    setTimeout(() => {
      track?.classList.remove('transition')
      this.currentIndex = indexVal;
      setTimeout(() => {
        track?.classList.add('transition')
      }, 50);
    }, 300);
  }
  prev() {
    if (!this.config.wrapAround) {
      this.handleNonInfiniteScroll(-this.slidesToShow)
      return
    }
    const maxLeftScroll = this.slidesToShow
    if (this.currentIndex <= maxLeftScroll) {
      this.currentIndex -= this.slidesToScroll;
      this.#resetScroll(this.currentIndex + this.slideCount)
    } else {
      this.currentIndex -= this.slidesToScroll;
    }
  }
  next() {
    if (!this.config.wrapAround) {
      this.handleNonInfiniteScroll(this.slidesToShow)
      return
    }
    const maxRightScroll = this.slideCount - this.slidesToScroll
    if (this.currentIndex >= maxRightScroll) {
      this.currentIndex += this.slidesToScroll;
      this.#resetScroll(this.currentIndex - this.slideCount)
    } else {
      this.currentIndex += this.slidesToScroll;
    }
  }
  jump(index: number) {
    this.currentIndex = index + Math.floor(this.slidesToShow)
  }
}

customElements.define("slide-component", SlideComponent);
customElements.define("carousel-component", CarouselComponent);