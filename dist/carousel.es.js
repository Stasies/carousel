var L = Object.defineProperty;
var f = (i) => {
  throw TypeError(i);
};
var b = (i, s, e) => s in i ? L(i, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[s] = e;
var l = (i, s, e) => b(i, typeof s != "symbol" ? s + "" : s, e), C = (i, s, e) => s.has(i) || f("Cannot " + e);
var m = (i, s, e) => s.has(i) ? f("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(i) : s.set(i, e);
var r = (i, s, e) => (C(i, s, "access private method"), e);
class k extends HTMLElement {
  constructor() {
    super();
    l(this, "rendered");
    this.rendered = !1;
  }
  connectedCallback() {
    this.render();
  }
  render() {
    if (this.rendered)
      return;
    const e = document.createElement("div");
    e.classList.add("slide"), Array.from(this.childNodes).forEach((o) => {
      e.appendChild(o.cloneNode(!0));
    }), this.replaceWith(e), this.rendered = !0;
  }
}
function M(i) {
  if (typeof i != "object" || i === null)
    return "invalid value type. Breakpoints should be an object";
  for (const s in i) {
    if (isNaN(Number(s)))
      return "Breakpoints should contain keys typeof number";
    const e = i[s];
    if (typeof e != "object" || e === null || e.itemsToShow && typeof e.itemsToShow != "number" || e.itemsToScroll && typeof e.itemsToScroll != "number")
      return "invalid value type. Pass an object with keys itemsToShow and itemsToScroll and values typeof number";
  }
  return !1;
}
const v = {
  get(i, s) {
    var e, n, o;
    if (!i[s])
      return !1;
    if (s == "autoplay")
      return String((e = i[s]) == null ? void 0 : e.value) !== "false" && isNaN(+((n = i[s]) == null ? void 0 : n.value)) ? (console.warn("invalid autoplay value type. Pass a number to set interval or false to disable autoplay"), !1) : +((o = i[s]) == null ? void 0 : o.value);
    if (s == "breakpoints") {
      let h = M(i[s]);
      return h ? (console.warn(`Error in ${s}. ${h}`), {
        0: {
          itemsToShow: 1,
          itemsToScroll: 1
        }
      }) : i[s];
    }
    if (s == "wrapAround")
      return String(i[s].value).match(/true|false/) ? i[s] : (console.warn("invalid wrapAround value type. Expected boolean. Set to default value."), !1);
  }
};
var t, p, x, g, S, y, w, I, d, c, a, T, E, u;
class A extends HTMLElement {
  constructor(...e) {
    super();
    m(this, t);
    l(this, "slides");
    l(this, "config");
    l(this, "_currentIndex");
    l(this, "maxIndex");
    l(this, "slidesToShow");
    l(this, "slideCount");
    l(this, "slidesToScroll");
    l(this, "slideWidth");
    l(this, "isDragging");
    l(this, "startX");
    l(this, "dragOffset");
    l(this, "interval");
    this.config = new Proxy(this.attributes, v), this.slides = [], this.interval = null, this.slideWidth = 100, this.slideCount = 0, this._currentIndex = 0, this.maxIndex = 0, this.slidesToShow = 1, this.slidesToScroll = 1, this.isDragging = !1, this.startX = 0, this.dragOffset = 0;
  }
  static get observedAttributes() {
    return ["autoplay", "wraparound", "breakpoints"];
  }
  // attributeChangedCallback() {
  //   console.log('changes')
  // }
  get currentIndex() {
    return this._currentIndex;
  }
  set currentIndex(e) {
    this._currentIndex = Math.min(Math.max(e, 0), this.maxIndex), r(this, t, T).call(this), r(this, t, E).call(this);
  }
  connectedCallback() {
    r(this, t, p).call(this), r(this, t, g).call(this), r(this, t, x).call(this), this.render(), r(this, t, w).call(this), r(this, t, S).call(this), r(this, t, y).call(this);
  }
  disconnectedCallback() {
    r(this, t, I);
  }
  render() {
    var o;
    if (this.querySelector(".carousel")) return;
    this.config = new Proxy(this.attributes, v), this.innerHTML = "";
    const e = document.createElement("div");
    e.classList.add("carousel");
    const n = document.createElement("div");
    n.classList.add("carousel-track", "transition"), (o = this.slides) == null || o.forEach((h) => n.appendChild(h)), e.appendChild(n), this.appendChild(e);
  }
  startAutoPlay() {
    this.config.autoplay && (this.interval = setInterval(() => this.next(), this.config.autoplay));
  }
  stopAutoPlay() {
    clearInterval(this.interval);
  }
  handleNonInfiniteScroll(e) {
    this.currentIndex += e, this.maxIndex == this.currentIndex && this.stopAutoPlay();
  }
  prev() {
    if (!this.config.wraparound) {
      this.handleNonInfiniteScroll(-this.slidesToShow);
      return;
    }
    const e = this.slidesToShow;
    this.currentIndex <= e ? (this.currentIndex -= this.slidesToScroll, r(this, t, u).call(this, this.currentIndex + this.slideCount)) : this.currentIndex -= this.slidesToScroll;
  }
  next() {
    if (!this.config.wraparound) {
      this.handleNonInfiniteScroll(this.slidesToShow);
      return;
    }
    const e = this.slideCount - this.slidesToScroll;
    this.currentIndex >= e ? (this.currentIndex += this.slidesToScroll, r(this, t, u).call(this, this.currentIndex - this.slideCount)) : this.currentIndex += this.slidesToScroll;
  }
  jump(e) {
    this.currentIndex = e + Math.floor(this.slidesToShow);
  }
}
t = new WeakSet(), p = function() {
  const e = document.createElement("style");
  e.textContent = `
    .carousel {
      border: 1px solid grey;
      overflow: hidden;
      display: flex;
      height: 400px;
    }
    .carousel-track {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      user-select: none;
    }
    .transition {
      transition: transform 0.3s ease;
    }
    .slide{
      height: 100%;
      flex: 0 0 auto;
      box-sizing: border-box;
    }
    `, document.head.appendChild(e);
}, x = function() {
  const e = Array.from(this.children);
  this.slideCount = e.length;
  const n = e.slice(0, Math.floor(this.slidesToShow)).map((h) => h.cloneNode(!0)), o = e.slice(-Math.floor(this.slidesToShow)).map((h) => h.cloneNode(!0));
  this.slides = this.config.wraparound ? [...o, ...e, ...n] : e;
}, g = function() {
  for (let e in this.config.breakpoints)
    window.innerWidth >= +e && (this.slidesToShow = this.config.breakpoints[+e].itemsToShow || 1, this.slidesToScroll = this.config.breakpoints[+e].itemsToScroll || this.config.breakpoints[+e].itemsToShow || 1);
}, S = function() {
  var e;
  this.slideWidth = 100 / this.slidesToShow, (e = this.slides) == null || e.forEach((n) => {
    n.setAttribute("style", `width: ${this.slideWidth}%`);
  });
}, y = function() {
  this.maxIndex = this.config.wraparound ? this.slideCount : Math.max(this.slideCount - this.slidesToShow, 0), this.currentIndex = this.config.wraparound ? Math.floor(this.slidesToShow) : 0;
}, w = function() {
  this.addEventListener("mousedown", r(this, t, d)), this.addEventListener("touchstart", r(this, t, d), { passive: !0 }), this.addEventListener("mousemove", r(this, t, c)), this.addEventListener("touchmove", r(this, t, c), { passive: !0 }), this.addEventListener("mouseup", r(this, t, a)), this.addEventListener("mouseleave", r(this, t, a)), this.addEventListener("touchend", r(this, t, a)), this.config.autoplay && (this.startAutoPlay(), this.addEventListener("mouseenter", () => this.stopAutoPlay()), this.addEventListener("mouseleave", () => this.startAutoPlay()));
}, I = function() {
  this.removeEventListener("mousedown", r(this, t, d)), this.removeEventListener("touchstart", r(this, t, d)), this.removeEventListener("mousemove", r(this, t, c)), this.removeEventListener("touchmove", r(this, t, c)), this.removeEventListener("mouseup", r(this, t, a)), this.removeEventListener("mouseleave", r(this, t, a)), this.removeEventListener("touchend", r(this, t, a));
}, d = function(e) {
  this.stopAutoPlay(), this.slidesToScroll = 1, this.isDragging = !0, this.startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX, this.dragOffset = 0;
}, c = function(e) {
  if (!this.isDragging) return;
  const n = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  this.dragOffset = n - this.startX, (this.currentIndex >= this.maxIndex && this.dragOffset < 0 || this.currentIndex <= 0 && this.dragOffset > 0) && (this.dragOffset = 0);
  const o = this.querySelector(".carousel-track");
  o && (o.style.transform = `translateX(calc(-${this.currentIndex * this.slideWidth}% + ${this.dragOffset}px))`);
}, a = function() {
  if (!this.isDragging) return;
  this.isDragging = !1;
  const e = this.slideWidth / 3;
  Math.abs(this.dragOffset) > e && (this.dragOffset < 0 ? this.next() : this.currentIndex > 0 && this.prev());
}, T = function() {
  let e = this.querySelector(".carousel-track");
  e.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`;
}, E = function() {
  var e;
  (e = this.slides) == null || e.forEach((n, o) => {
    n instanceof HTMLElement && (n.classList.remove("prev", "current", "next", "hidden"), o === this.currentIndex ? n.classList.add("current") : o === this.currentIndex - 1 ? n.classList.add("prev") : o === this.currentIndex + 1 ? n.classList.add("next") : (o < this.currentIndex - 1 || o > this.currentIndex + this.slidesToShow) && n.classList.add("hidden"));
  });
}, u = function(e) {
  let n = this.querySelector(".carousel-track");
  setTimeout(() => {
    n == null || n.classList.remove("transition"), this.currentIndex = e, setTimeout(() => {
      n == null || n.classList.add("transition");
    }, 50);
  }, 300);
};
customElements.define("slide-component", k);
customElements.define("carousel-component", A);
export {
  A as CarouselComponent
};
