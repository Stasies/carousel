var E = Object.defineProperty;
var v = (r) => {
  throw TypeError(r);
};
var C = (r, n, t) => n in r ? E(r, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[n] = t;
var a = (r, n, t) => C(r, typeof n != "symbol" ? n + "" : n, t), M = (r, n, t) => n.has(r) || v("Cannot " + t);
var x = (r, n, t) => n.has(r) ? v("Cannot add the same private member more than once") : n instanceof WeakSet ? n.add(r) : n.set(r, t);
var s = (r, n, t) => (M(r, n, "access private method"), t);
class O extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.classList.add("slide");
    const n = document.createElement("style");
    n.textContent = `
    .slide{
      height: 100%;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: block;
    }
    `, document.head.appendChild(n);
  }
}
function A(r) {
  if (typeof r != "object" || r === null)
    return "invalid value type. Breakpoints should be an object";
  for (const n in r) {
    if (isNaN(Number(n)))
      return "Breakpoints should contain keys typeof number";
    const t = r[n];
    if (typeof t != "object" || t === null || t.slidesToShow && typeof t.slidesToShow != "number" || t.slidesToScroll && typeof t.slidesToScroll != "number")
      return "invalid value type. Pass an object with keys itemsToShow and itemsToScroll and values typeof number";
  }
  return !1;
}
var e, S, u, g, b, y, I, k, L, d, c, h, T, w, f;
class X extends HTMLElement {
  constructor() {
    super();
    x(this, e);
    a(this, "observer", null);
    a(this, "slides");
    a(this, "initialSlides");
    a(this, "rendered");
    a(this, "autoplay");
    a(this, "wraparound");
    a(this, "_currentIndex");
    a(this, "_breakpoints");
    a(this, "maxIndex");
    a(this, "slidesToShow");
    a(this, "slideCount");
    a(this, "slidesToScroll");
    a(this, "slideWidth");
    a(this, "isDragging");
    a(this, "startX");
    a(this, "dragOffset");
    a(this, "interval");
    this.initialSlides = [], this.rendered = !1, this._breakpoints = {}, this.autoplay = !1, this.wraparound = !1, this.slides = [], this.interval = null, this.slideWidth = 100, this.slideCount = 0, this._currentIndex = 0, this.maxIndex = 0, this.slidesToShow = 1, this.slidesToScroll = 1, this.isDragging = !1, this.startX = 0, this.dragOffset = 0;
  }
  static get observedAttributes() {
    return ["autoplay", "wraparound", "breakpoints"];
  }
  attributeChangedCallback(t, i, o) {
    switch (console.log(`Attribute ${t} changed from ${i} to ${o}`), t) {
      case "autoplay":
        this.autoplay = parseInt(o, 10) || !1, this.startAutoPlay();
        break;
      case "wraparound":
        this.wraparound = o.match(/true|false/) ? JSON.parse(o) : !1;
        break;
    }
  }
  set breakpoints(t) {
    A(t) || (this._breakpoints = t), this.updateBreakpoints();
  }
  get breakpoints() {
    return this._breakpoints;
  }
  updateBreakpoints() {
    s(this, e, b).call(this), s(this, e, u).call(this);
  }
  get currentIndex() {
    return this._currentIndex;
  }
  set currentIndex(t) {
    this._currentIndex = Math.min(Math.max(t, 0), this.maxIndex), s(this, e, T).call(this), s(this, e, w).call(this), console.log(this.currentIndex);
  }
  connectedCallback() {
    s(this, e, S).call(this), this.observeSlides(), s(this, e, u).call(this), s(this, e, k).call(this);
  }
  disconnectedCallback() {
    s(this, e, L).call(this);
  }
  render() {
    var o;
    this.innerHTML = "";
    const t = document.createElement("div");
    t.classList.add("carousel");
    const i = document.createElement("div");
    i.classList.add("carousel-track", "transition"), (o = this.slides) == null || o.forEach((l) => i.appendChild(l)), t.appendChild(i), this.appendChild(t);
  }
  observeSlides() {
    const t = (i, o) => {
      var l;
      (l = this.observer) == null || l.disconnect();
      for (const m of i)
        m.type === "childList" && m.addedNodes.forEach((p) => {
          p.classList && p.classList.contains("slide") && (this.initialSlides.push(p), s(this, e, u).call(this));
        });
    };
    this.observer = new MutationObserver(t), this.observer.observe(this, { childList: !0, subtree: !0 });
  }
  startAutoPlay() {
    this.autoplay && (this.interval = setInterval(() => this.next(), this.autoplay));
  }
  stopAutoPlay() {
    clearInterval(this.interval);
  }
  handleNonInfiniteScroll(t) {
    this.currentIndex += t, this.maxIndex == this.currentIndex && this.stopAutoPlay();
  }
  prev() {
    if (!this.wraparound) {
      this.handleNonInfiniteScroll(-this.slidesToScroll);
      return;
    }
    this.currentIndex <= 1 ? (this.currentIndex -= this.slidesToScroll, s(this, e, f).call(this, this.currentIndex + this.slideCount)) : this.currentIndex -= this.slidesToScroll;
  }
  next() {
    if (!this.wraparound) {
      this.handleNonInfiniteScroll(this.slidesToScroll);
      return;
    }
    const t = this.slideCount - this.slidesToScroll;
    this.currentIndex >= t ? (this.currentIndex += this.slidesToScroll, s(this, e, f).call(this, this.currentIndex - this.slideCount)) : this.currentIndex += this.slidesToScroll;
  }
  jump(t) {
    this.currentIndex = t + Math.floor(this.slidesToShow);
  }
}
e = new WeakSet(), S = function() {
  const t = document.createElement("style");
  t.textContent = `
    carousel-component{
      display: block;
      height: 100%;
      width: 100%;
    }
    .carousel {
      overflow: hidden;
      display: flex;
      height: 100%;
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
    `, document.head.appendChild(t);
}, u = function() {
  console.log("initialising"), s(this, e, g).call(this), this.render(), s(this, e, y).call(this), s(this, e, I).call(this);
}, g = function() {
  this.querySelector(".carousel-track") || (this.initialSlides = Array.from(this.children)), console.log(this.initialSlides), this.slideCount = this.initialSlides.length;
  const i = this.initialSlides.slice(0, Math.floor(this.slidesToShow)).map((l) => l.cloneNode(!0)), o = this.initialSlides.slice(-Math.floor(this.slidesToShow)).map((l) => l.cloneNode(!0));
  this.slides = this.wraparound ? [...o, ...this.initialSlides, ...i] : this.initialSlides;
}, b = function() {
  for (let t in this.breakpoints)
    window.innerWidth >= +t && (this.slidesToShow = this.breakpoints[+t].slidesToShow || 1, this.slidesToScroll = this.breakpoints[+t].slidesToScroll || this.breakpoints[+t].slidesToShow || 1);
}, y = function() {
  var t;
  this.slideWidth = 100 / this.slidesToShow, (t = this.slides) == null || t.forEach((i) => {
    i.setAttribute("style", `width: ${this.slideWidth}%`);
  });
}, I = function() {
  this.maxIndex = this.wraparound ? this.slideCount : Math.max(this.slideCount - this.slidesToShow, 0), this.currentIndex = this.wraparound ? Math.floor(this.slidesToShow) : 0;
}, k = function() {
  this.addEventListener("mousedown", s(this, e, d)), this.addEventListener("touchstart", s(this, e, d), { passive: !0 }), this.addEventListener("mousemove", s(this, e, c)), this.addEventListener("touchmove", s(this, e, c), { passive: !0 }), this.addEventListener("mouseup", s(this, e, h)), this.addEventListener("mouseleave", s(this, e, h)), this.addEventListener("touchend", s(this, e, h)), window.addEventListener("resize", () => this.updateBreakpoints()), this.startAutoPlay(), this.addEventListener("mouseenter", () => this.stopAutoPlay()), this.addEventListener("mouseleave", () => this.startAutoPlay());
}, L = function() {
  this.removeEventListener("mousedown", s(this, e, d)), this.removeEventListener("touchstart", s(this, e, d)), this.removeEventListener("mousemove", s(this, e, c)), this.removeEventListener("touchmove", s(this, e, c)), this.removeEventListener("mouseup", s(this, e, h)), this.removeEventListener("mouseleave", s(this, e, h)), this.removeEventListener("touchend", s(this, e, h));
}, d = function(t) {
  this.stopAutoPlay(), this.slidesToScroll = 1, this.isDragging = !0, this.startX = t instanceof MouseEvent ? t.clientX : t.touches[0].clientX, this.dragOffset = 0;
}, c = function(t) {
  if (!this.isDragging) return;
  const i = t instanceof MouseEvent ? t.clientX : t.touches[0].clientX;
  this.dragOffset = i - this.startX, (this.currentIndex >= this.maxIndex && this.dragOffset < 0 || this.currentIndex <= 0 && this.dragOffset > 0) && (this.dragOffset = 0);
  const o = this.querySelector(".carousel-track");
  o && (o.style.transform = `translateX(calc(-${this.currentIndex * this.slideWidth}% + ${this.dragOffset}px))`);
}, h = function() {
  if (!this.isDragging) return;
  this.isDragging = !1;
  const t = this.slideWidth / 3;
  Math.abs(this.dragOffset) > t && (this.dragOffset < 0 ? this.next() : this.currentIndex > 0 && this.prev());
}, T = function() {
  let t = this.querySelector(".carousel-track");
  t.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`;
}, w = function() {
  var t;
  (t = this.slides) == null || t.forEach((i, o) => {
    i instanceof HTMLElement && (i.classList.remove("prev", "current", "next", "hidden"), o === this.currentIndex ? i.classList.add("current") : o === this.currentIndex - 1 ? i.classList.add("prev") : o === this.currentIndex + 1 && i.classList.add("next"), (o < this.currentIndex - 1 || o > this.currentIndex + this.slidesToShow) && i.classList.add("hidden"));
  });
}, f = function(t) {
  let i = this.querySelector(".carousel-track");
  setTimeout(() => {
    i == null || i.classList.remove("transition"), this.currentIndex = t, setTimeout(() => {
      i == null || i.classList.add("transition");
    }, 50);
  }, 300);
};
customElements.define("carousel-component", X);
customElements.define("slide-component", O);
export {
  X as CarouselComponent
};
