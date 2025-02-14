// type Config = {
//   slidesToShow: number;
//   slidesToScroll: number;
//   autoplay?: number;
//   breakpoints?: Record<number, { itemsToShow: number; itemsToScroll: number }>;
//   draggable?: boolean;
//   wrapAround?: boolean;
//   pauseOnHover?: boolean;
// };

// export class CarouselComponent extends HTMLElement {
//   breakpoints: any;
//   autoplay: number | false;
//   interval: any;
//   wrapAround: boolean;
//   _currentIndex = 1;
//   maxIndex = 1;
//   slides: Element[] | null = null;
//   slideWidth = 0;
//   slidesToShow = 1.5;
//   slidesToScroll = 1;
//   isTransitioning = true;
//   isDragging = false;
//   startX = 0;
//   dragOffset = 0;

//   constructor(config: Config) {
//     super();
//     this.slideWidth = 100;
//     this.wrapAround = config?.wrapAround || false;
//     this.autoplay = config?.autoplay || 2000;
//     this.breakpoints = config?.breakpoints || {
//       0: { itemsToShow: 1, itemsToScroll: 1 },
//     };
//   }

//   get currentIndex() {
//     return this._currentIndex;
//   }

//   set currentIndex(value: number) {
//     this._currentIndex = Math.min(Math.max(value, 0), this.maxIndex);
//     this.updateSlideClasses();
//   }

//   connectedCallback() {
//     this.render();
//     this.setupEventListeners();
//     this.setupCarousel();
//   }

//   disconnectedCallback() {
//     this.removeEventListeners();
//   }

//   setupEventListeners() {
//     this.addEventListener("mousedown", this.onDragStart);
//     this.addEventListener("touchstart", this.onDragStart, { passive: true });
//     this.addEventListener("mousemove", this.onDragMove);
//     this.addEventListener("touchmove", this.onDragMove, { passive: true });
//     this.addEventListener("mouseup", this.onDragEnd);
//     this.addEventListener("mouseleave", this.onDragEnd);
//     this.addEventListener("touchend", this.onDragEnd);
//   }

//   removeEventListeners() {
//     this.removeEventListener("mousedown", this.onDragStart);
//     this.removeEventListener("touchstart", this.onDragStart);
//     this.removeEventListener("mousemove", this.onDragMove);
//     this.removeEventListener("touchmove", this.onDragMove);
//     this.removeEventListener("mouseup", this.onDragEnd);
//     this.removeEventListener("mouseleave", this.onDragEnd);
//     this.removeEventListener("touchend", this.onDragEnd);
//   }

//   setupCarousel() {
//     const slot = this.querySelector("slot") as HTMLSlotElement;
//     console.log(this.firstChild?.childNodes[0].children)
//     const assignedSlides = Array.from(this.firstChild?.children[0].children as any) || [];
//     console.log(assignedSlides)
//     this.setUpAutoplay();
//     // slot?.addEventListener("slotchange", () => {
//     //   this.updateResponsiveSettings();
//     // });
//     this.setupSlides(assignedSlides);
//     window.addEventListener("resize", () => this.updateResponsiveSettings());

//     this.updateResponsiveSettings();
//     this.currentIndex = this.wrapAround ? Math.floor(this.slidesToShow) : 0;
//     this.maxIndex = this.wrapAround
//       ? assignedSlides.length
//       : Math.max(assignedSlides.length - this.slidesToShow, 0);
//   }

//   onDragStart = (e: MouseEvent | TouchEvent) => {
//     this.stopAutoPlay();
//     this.isDragging = true;
//     this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
//     this.dragOffset = 0;
//   };

//   onDragMove = (e: MouseEvent | TouchEvent) => {
//     if (!this.isDragging) return;
//     const currentX =
//       e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
//     this.dragOffset = currentX - this.startX;
//     const track = this.querySelector(".carousel-track") as HTMLElement;
//     if (track) {
//       track.style.transform = `translateX(calc(-${this.currentIndex * this.slideWidth
//         }% + ${this.dragOffset}px))`;
//     }
//   };

//   onDragEnd = () => {
//     if (!this.isDragging) return;
//     this.isDragging = false;

//     const threshold = this.slideWidth / 3;
//     if (Math.abs(this.dragOffset) > threshold) {
//       if (this.dragOffset < 0) {
//         this.next();
//       } else if (this.currentIndex > 0) {
//         this.prev();
//       }
//     }
//   };

//   setUpAutoplay() {
//     if (!this.autoplay) return;
//     const carousel = this.querySelector(".carousel") as HTMLElement;
//     this.startAutoPlay();
//     carousel.addEventListener("mouseenter", () => this.stopAutoPlay());
//     carousel.addEventListener("mouseleave", () => this.startAutoPlay());
//   }

//   startAutoPlay() {
//     if (this.autoplay && typeof this.autoplay === "number") {
//       this.interval = setInterval(() => this.next(), this.autoplay);
//     }
//   }

//   stopAutoPlay() {
//     clearInterval(this.interval);
//   }

//   setupSlides(assignedSlides: any[]) {
//     const firstClones = assignedSlides
//       .slice(0, Math.floor(this.slidesToShow))
//       .map((el) => el.cloneNode(true)) as any[];
//     const lastClones = assignedSlides
//       .slice(-Math.floor(this.slidesToShow))
//       .map((el) => el.cloneNode(true)) as any[];
//     this.slides = this.wrapAround
//       ? [...lastClones, ...assignedSlides, ...firstClones]
//       : assignedSlides;

//     this.updateSlideClasses();
//   }

//   updateSlideClasses() {
//     this.slides?.forEach((slide, index) => {
//       if (!(slide instanceof HTMLElement)) return;
//       let status = "";
//       if (index === this.currentIndex) status = "current";
//       else if (index === this.currentIndex - 1) status = "prev";
//       else if (index === this.currentIndex + 1) status = "next";

//       slide.setAttribute("status", status);
//     });
//   }

//   updateResponsiveSettings() {
//     for (let point in this.breakpoints) {
//       if (window.innerWidth >= +point) {
//         this.slidesToShow = this.breakpoints[point].itemsToShow || 1;
//         this.slidesToScroll =
//           this.breakpoints[point].itemsToScroll ||
//           this.breakpoints[point].itemsToShow ||
//           1;
//       }
//     }
//     this.slideWidth = 100 / this.slidesToShow;
//     console.log(this.slides)
//     this.slides?.forEach((slide) => {
//       slide.setAttribute("style", `width: ${this.slideWidth}%`);
//     });
//   }

//   resetScroll(indexVal: number) {
//     setTimeout(() => {
//       this.isTransitioning = false;
//       this.currentIndex = indexVal;
//       setTimeout(() => {
//         this.isTransitioning = true;
//       }, 50);
//     }, 300);
//   }

//   prev() {
//     if (!this.wrapAround) {
//       this.currentIndex -= this.slidesToShow;
//       return;
//     }
//     if (this.currentIndex <= this.slidesToShow) {
//       this.currentIndex -= this.slidesToScroll;
//       this.resetScroll(this.currentIndex + this.slides!.length);
//     } else {
//       this.currentIndex -= this.slidesToScroll;
//     }
//   }

//   next() {
//     if (!this.wrapAround) {
//       this.currentIndex += this.slidesToShow;
//       return;
//     }
//     if (this.currentIndex >= this.slides!.length - this.slidesToScroll) {
//       this.currentIndex += this.slidesToScroll;
//       this.resetScroll(this.currentIndex - this.slides!.length);
//     } else {
//       this.currentIndex += this.slidesToScroll;
//     }
//   }

//   render() {
//     // Ensure we only render once
//     if (this.querySelector(".carousel")) return;

//     const slides = Array.from(this.childNodes); // Save children before clearing
//     this.innerHTML = ""

//     const wrapper = document.createElement("div");
//     wrapper.classList.add("carousel");

//     const track = document.createElement("div");
//     track.classList.add("carousel-track");

//     slides.forEach((node) => track.appendChild(node));
//     wrapper.appendChild(track);
//     this.appendChild(wrapper)



//     // Navigation Buttons
//     const prevBtn = document.createElement("button");
//     prevBtn.textContent = "Prev";
//     prevBtn.onclick = () => this.prev();

//     const nextBtn = document.createElement("button");
//     nextBtn.textContent = "Next";
//     nextBtn.onclick = () => this.next();

//     this.appendChild(prevBtn);
//     this.appendChild(nextBtn);
//   }

// }

// customElements.define("carousel-component", CarouselComponent);
