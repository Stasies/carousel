var E = Object.defineProperty;
var f = (i) => {
  throw TypeError(i);
};
var L = (i, s, t) => s in i ? E(i, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[s] = t;
var l = (i, s, t) => L(i, typeof s != "symbol" ? s + "" : s, t), b = (i, s, t) => s.has(i) || f("Cannot " + t);
var m = (i, s, t) => s.has(i) ? f("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(i) : s.set(i, t);
var r = (i, s, t) => (b(i, s, "access private method"), t);
class C extends HTMLElement {
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
    const t = document.createElement("div");
    t.classList.add("slide"), Array.from(this.childNodes).forEach((o) => {
      t.appendChild(o.cloneNode(!0));
    }), this.replaceWith(t), this.rendered = !0;
  }
}
function k(i) {
  if (typeof i != "object" || i === null)
    return "invalid value type. Breakpoints should be an object";
  for (const s in i) {
    if (isNaN(Number(s)))
      return "Breakpoints should contain keys typeof number";
    const t = i[s];
    if (typeof t != "object" || t === null || t.itemsToShow && typeof t.itemsToShow != "number" || t.itemsToScroll && typeof t.itemsToScroll != "number")
      return "invalid value type. Pass an object with keys itemsToShow and itemsToScroll and values typeof number";
  }
  return !1;
}
const v = {
  get(i, s) {
    var t, n, o;
    if (!i[s])
      return !1;
    if (s == "autoplay")
      return String((t = i[s]) == null ? void 0 : t.value) !== "false" && isNaN(+((n = i[s]) == null ? void 0 : n.value)) ? (console.warn("invalid autoplay value type. Pass a number to set interval or false to disable autoplay"), !1) : +((o = i[s]) == null ? void 0 : o.value);
    if (s == "breakpoints") {
      let h = k(i[s]);
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
var e, p, x, S, g, I, T, d, c, a, w, y, u;
class A extends HTMLElement {
  constructor(...t) {
    super();
    m(this, e);
    l(this, "slides");
    l(this, "config");
    l(this, "_currentIndex");
    l(this, "maxIndex");
    l(this, "breakpoints");
    l(this, "slidesToShow");
    l(this, "slideCount");
    l(this, "slidesToScroll");
    l(this, "slideWidth");
    l(this, "isDragging");
    l(this, "startX");
    l(this, "dragOffset");
    l(this, "interval");
    this.breakpoints = {
      0: {
        itemsToShow: 1,
        itemsToScroll: 1
      }
    }, this.config = new Proxy(this.attributes, v), this.slides = [], this.interval = null, this.slideWidth = 100, this.slideCount = 0, this._currentIndex = 0, this.maxIndex = 0, this.slidesToShow = 1, this.slidesToScroll = 1, this.isDragging = !1, this.startX = 0, this.dragOffset = 0;
  }
  static get observedAttributes() {
    return ["autoplay", "wrapAround", "breakpoints"];
  }
  // attributeChangedCallback() {
  //   console.log('changes')
  // }
  get currentIndex() {
    return this._currentIndex;
  }
  set currentIndex(t) {
    this._currentIndex = Math.min(Math.max(t, 0), this.maxIndex), r(this, e, w).call(this), r(this, e, y).call(this);
  }
  connectedCallback() {
    r(this, e, x).call(this), r(this, e, p).call(this), this.render(), r(this, e, I).call(this), r(this, e, S).call(this), r(this, e, g).call(this);
  }
  disconnectedCallback() {
    r(this, e, T);
  }
  render() {
    var o;
    if (this.querySelector(".carousel"))
      return;
    this.config = new Proxy(this.attributes, v), this.innerHTML = "";
    const t = document.createElement("div");
    t.classList.add("carousel");
    const n = document.createElement("div");
    n.classList.add("carousel-track", "transition"), (o = this.slides) == null || o.forEach((h) => n.appendChild(h)), t.appendChild(n), this.appendChild(t);
  }
  startAutoPlay() {
    this.config.autoplay && (this.interval = setInterval(() => this.next(), this.config.autoplay));
  }
  stopAutoPlay() {
    clearInterval(this.interval);
  }
  handleNonInfiniteScroll(t) {
    this.currentIndex += t, this.maxIndex == this.currentIndex && this.stopAutoPlay();
  }
  prev() {
    if (!this.config.wrapAround) {
      this.handleNonInfiniteScroll(-this.slidesToShow);
      return;
    }
    const t = this.slidesToShow;
    this.currentIndex <= t ? (this.currentIndex -= this.slidesToScroll, r(this, e, u).call(this, this.currentIndex + this.slideCount)) : this.currentIndex -= this.slidesToScroll;
  }
  next() {
    if (!this.config.wrapAround) {
      this.handleNonInfiniteScroll(this.slidesToShow);
      return;
    }
    const t = this.slideCount - this.slidesToScroll;
    this.currentIndex >= t ? (this.currentIndex += this.slidesToScroll, r(this, e, u).call(this, this.currentIndex - this.slideCount)) : this.currentIndex += this.slidesToScroll;
  }
  jump(t) {
    this.currentIndex = t + Math.floor(this.slidesToShow);
  }
}
e = new WeakSet(), p = function() {
  const t = Array.from(this.children);
  this.slideCount = t.length;
  const n = t.slice(0, Math.floor(this.slidesToShow)).map((h) => h.cloneNode(!0)), o = t.slice(-Math.floor(this.slidesToShow)).map((h) => h.cloneNode(!0));
  this.slides = this.config.wrapAround ? [...o, ...t, ...n] : t;
}, x = function() {
  for (let t in this.breakpoints)
    window.innerWidth >= +t && (this.slidesToShow = this.breakpoints[+t].itemsToShow || 1, this.slidesToScroll = this.breakpoints[+t].itemsToScroll || this.breakpoints[+t].itemsToShow || 1);
}, S = function() {
  var t;
  this.slideWidth = 100 / this.slidesToShow, (t = this.slides) == null || t.forEach((n) => {
    n.setAttribute("style", `width: ${this.slideWidth}%`);
  });
}, g = function() {
  this.maxIndex = this.config.wrapAround ? this.slideCount : Math.max(this.slideCount - this.slidesToShow, 0), this.currentIndex = this.config.wrapAround ? Math.floor(this.slidesToShow) : 0;
}, I = function() {
  this.addEventListener("mousedown", r(this, e, d)), this.addEventListener("touchstart", r(this, e, d), { passive: !0 }), this.addEventListener("mousemove", r(this, e, c)), this.addEventListener("touchmove", r(this, e, c), { passive: !0 }), this.addEventListener("mouseup", r(this, e, a)), this.addEventListener("mouseleave", r(this, e, a)), this.addEventListener("touchend", r(this, e, a)), this.config.autoplay && (this.startAutoPlay(), this.addEventListener("mouseenter", () => this.stopAutoPlay()), this.addEventListener("mouseleave", () => this.startAutoPlay()));
}, T = function() {
  this.removeEventListener("mousedown", r(this, e, d)), this.removeEventListener("touchstart", r(this, e, d)), this.removeEventListener("mousemove", r(this, e, c)), this.removeEventListener("touchmove", r(this, e, c)), this.removeEventListener("mouseup", r(this, e, a)), this.removeEventListener("mouseleave", r(this, e, a)), this.removeEventListener("touchend", r(this, e, a));
}, d = function(t) {
  this.stopAutoPlay(), this.slidesToScroll = 1, this.isDragging = !0, this.startX = t instanceof MouseEvent ? t.clientX : t.touches[0].clientX, this.dragOffset = 0;
}, c = function(t) {
  if (!this.isDragging)
    return;
  const n = t instanceof MouseEvent ? t.clientX : t.touches[0].clientX;
  this.dragOffset = n - this.startX, (this.currentIndex >= this.maxIndex && this.dragOffset < 0 || this.currentIndex <= 0 && this.dragOffset > 0) && (this.dragOffset = 0);
  const o = this.querySelector(".carousel-track");
  o && (o.style.transform = `translateX(calc(-${this.currentIndex * this.slideWidth}% + ${this.dragOffset}px))`);
}, a = function() {
  if (!this.isDragging)
    return;
  this.isDragging = !1;
  const t = this.slideWidth / 3;
  Math.abs(this.dragOffset) > t && (this.dragOffset < 0 ? this.next() : this.currentIndex > 0 && this.prev());
}, w = function() {
  let t = this.querySelector(".carousel-track");
  t.style.transform = `translateX(-${this.currentIndex * this.slideWidth}%)`;
}, y = function() {
  var t;
  (t = this.slides) == null || t.forEach((n, o) => {
    n instanceof HTMLElement && (n.classList.remove("prev", "current", "next", "hidden"), o === this.currentIndex ? n.classList.add("current") : o === this.currentIndex - 1 ? n.classList.add("prev") : o === this.currentIndex + 1 ? n.classList.add("next") : (o < this.currentIndex - 1 || o > this.currentIndex + this.slidesToShow) && n.classList.add("hidden"));
  });
}, u = function(t) {
  let n = this.querySelector(".carousel-track");
  setTimeout(() => {
    n == null || n.classList.remove("transition"), this.currentIndex = t, setTimeout(() => {
      n == null || n.classList.add("transition");
    }, 50);
  }, 300);
};
customElements.define("slide-component", C);
customElements.define("carousel-component", A);
export {
  A as CarouselComponent
};
