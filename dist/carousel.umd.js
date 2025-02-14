(function(n,r){typeof exports=="object"&&typeof module<"u"?r(exports):typeof define=="function"&&define.amd?define(["exports"],r):(n=typeof globalThis<"u"?globalThis:n||self,r(n.carousel={}))})(this,function(n){"use strict";var M=Object.defineProperty;var g=n=>{throw TypeError(n)};var A=(n,r,d)=>r in n?M(n,r,{enumerable:!0,configurable:!0,writable:!0,value:d}):n[r]=d;var a=(n,r,d)=>A(n,typeof r!="symbol"?r+"":r,d),N=(n,r,d)=>r.has(n)||g("Cannot "+d);var S=(n,r,d)=>r.has(n)?g("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(n):r.set(n,d);var i=(n,r,d)=>(N(n,r,"access private method"),d);var t,y,T,w,I,E,L,b,f,m,u,C,k,v;class r extends HTMLElement{constructor(){super();a(this,"rendered");this.rendered=!1}connectedCallback(){this.render()}render(){if(this.rendered)return;const e=document.createElement("div");e.classList.add("slide"),Array.from(this.childNodes).forEach(o=>{e.appendChild(o.cloneNode(!0))}),this.replaceWith(e),this.rendered=!0}}function d(h){if(typeof h!="object"||h===null)return"invalid value type. Breakpoints should be an object";for(const l in h){if(isNaN(Number(l)))return"Breakpoints should contain keys typeof number";const e=h[l];if(typeof e!="object"||e===null||e.itemsToShow&&typeof e.itemsToShow!="number"||e.itemsToScroll&&typeof e.itemsToScroll!="number")return"invalid value type. Pass an object with keys itemsToShow and itemsToScroll and values typeof number"}return!1}const p={get(h,l){var e,s,o;if(!h[l])return!1;if(l=="autoplay")return String((e=h[l])==null?void 0:e.value)!=="false"&&isNaN(+((s=h[l])==null?void 0:s.value))?(console.warn("invalid autoplay value type. Pass a number to set interval or false to disable autoplay"),!1):+((o=h[l])==null?void 0:o.value);if(l=="breakpoints"){let c=d(h[l]);return c?(console.warn(`Error in ${l}. ${c}`),{0:{itemsToShow:1,itemsToScroll:1}}):h[l]}if(l=="wrapAround")return String(h[l].value).match(/true|false/)?h[l]:(console.warn("invalid wrapAround value type. Expected boolean. Set to default value."),!1)}};class x extends HTMLElement{constructor(...e){super();S(this,t);a(this,"slides");a(this,"config");a(this,"_currentIndex");a(this,"maxIndex");a(this,"slidesToShow");a(this,"slideCount");a(this,"slidesToScroll");a(this,"slideWidth");a(this,"isDragging");a(this,"startX");a(this,"dragOffset");a(this,"interval");this.config=new Proxy(this.attributes,p),this.slides=[],this.interval=null,this.slideWidth=100,this.slideCount=0,this._currentIndex=0,this.maxIndex=0,this.slidesToShow=1,this.slidesToScroll=1,this.isDragging=!1,this.startX=0,this.dragOffset=0}static get observedAttributes(){return["autoplay","wraparound","breakpoints"]}get currentIndex(){return this._currentIndex}set currentIndex(e){this._currentIndex=Math.min(Math.max(e,0),this.maxIndex),i(this,t,C).call(this),i(this,t,k).call(this)}connectedCallback(){i(this,t,y).call(this),i(this,t,w).call(this),i(this,t,T).call(this),this.render(),i(this,t,L).call(this),i(this,t,I).call(this),i(this,t,E).call(this)}disconnectedCallback(){i(this,t,b)}render(){var o;if(this.querySelector(".carousel"))return;this.config=new Proxy(this.attributes,p),this.innerHTML="";const e=document.createElement("div");e.classList.add("carousel");const s=document.createElement("div");s.classList.add("carousel-track","transition"),(o=this.slides)==null||o.forEach(c=>s.appendChild(c)),e.appendChild(s),this.appendChild(e)}startAutoPlay(){this.config.autoplay&&(this.interval=setInterval(()=>this.next(),this.config.autoplay))}stopAutoPlay(){clearInterval(this.interval)}handleNonInfiniteScroll(e){this.currentIndex+=e,this.maxIndex==this.currentIndex&&this.stopAutoPlay()}prev(){if(!this.config.wraparound){this.handleNonInfiniteScroll(-this.slidesToShow);return}const e=this.slidesToShow;this.currentIndex<=e?(this.currentIndex-=this.slidesToScroll,i(this,t,v).call(this,this.currentIndex+this.slideCount)):this.currentIndex-=this.slidesToScroll}next(){if(!this.config.wraparound){this.handleNonInfiniteScroll(this.slidesToShow);return}const e=this.slideCount-this.slidesToScroll;this.currentIndex>=e?(this.currentIndex+=this.slidesToScroll,i(this,t,v).call(this,this.currentIndex-this.slideCount)):this.currentIndex+=this.slidesToScroll}jump(e){this.currentIndex=e+Math.floor(this.slidesToShow)}}t=new WeakSet,y=function(){const e=document.createElement("style");e.textContent=`
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
    `,document.head.appendChild(e)},T=function(){const e=Array.from(this.children);this.slideCount=e.length;const s=e.slice(0,Math.floor(this.slidesToShow)).map(c=>c.cloneNode(!0)),o=e.slice(-Math.floor(this.slidesToShow)).map(c=>c.cloneNode(!0));this.slides=this.config.wraparound?[...o,...e,...s]:e},w=function(){for(let e in this.config.breakpoints)window.innerWidth>=+e&&(this.slidesToShow=this.config.breakpoints[+e].itemsToShow||1,this.slidesToScroll=this.config.breakpoints[+e].itemsToScroll||this.config.breakpoints[+e].itemsToShow||1)},I=function(){var e;this.slideWidth=100/this.slidesToShow,(e=this.slides)==null||e.forEach(s=>{s.setAttribute("style",`width: ${this.slideWidth}%`)})},E=function(){this.maxIndex=this.config.wraparound?this.slideCount:Math.max(this.slideCount-this.slidesToShow,0),this.currentIndex=this.config.wraparound?Math.floor(this.slidesToShow):0},L=function(){this.addEventListener("mousedown",i(this,t,f)),this.addEventListener("touchstart",i(this,t,f),{passive:!0}),this.addEventListener("mousemove",i(this,t,m)),this.addEventListener("touchmove",i(this,t,m),{passive:!0}),this.addEventListener("mouseup",i(this,t,u)),this.addEventListener("mouseleave",i(this,t,u)),this.addEventListener("touchend",i(this,t,u)),this.config.autoplay&&(this.startAutoPlay(),this.addEventListener("mouseenter",()=>this.stopAutoPlay()),this.addEventListener("mouseleave",()=>this.startAutoPlay()))},b=function(){this.removeEventListener("mousedown",i(this,t,f)),this.removeEventListener("touchstart",i(this,t,f)),this.removeEventListener("mousemove",i(this,t,m)),this.removeEventListener("touchmove",i(this,t,m)),this.removeEventListener("mouseup",i(this,t,u)),this.removeEventListener("mouseleave",i(this,t,u)),this.removeEventListener("touchend",i(this,t,u))},f=function(e){this.stopAutoPlay(),this.slidesToScroll=1,this.isDragging=!0,this.startX=e instanceof MouseEvent?e.clientX:e.touches[0].clientX,this.dragOffset=0},m=function(e){if(!this.isDragging)return;const s=e instanceof MouseEvent?e.clientX:e.touches[0].clientX;this.dragOffset=s-this.startX,(this.currentIndex>=this.maxIndex&&this.dragOffset<0||this.currentIndex<=0&&this.dragOffset>0)&&(this.dragOffset=0);const o=this.querySelector(".carousel-track");o&&(o.style.transform=`translateX(calc(-${this.currentIndex*this.slideWidth}% + ${this.dragOffset}px))`)},u=function(){if(!this.isDragging)return;this.isDragging=!1;const e=this.slideWidth/3;Math.abs(this.dragOffset)>e&&(this.dragOffset<0?this.next():this.currentIndex>0&&this.prev())},C=function(){let e=this.querySelector(".carousel-track");e.style.transform=`translateX(-${this.currentIndex*this.slideWidth}%)`},k=function(){var e;(e=this.slides)==null||e.forEach((s,o)=>{s instanceof HTMLElement&&(s.classList.remove("prev","current","next","hidden"),o===this.currentIndex?s.classList.add("current"):o===this.currentIndex-1?s.classList.add("prev"):o===this.currentIndex+1?s.classList.add("next"):(o<this.currentIndex-1||o>this.currentIndex+this.slidesToShow)&&s.classList.add("hidden"))})},v=function(e){let s=this.querySelector(".carousel-track");setTimeout(()=>{s==null||s.classList.remove("transition"),this.currentIndex=e,setTimeout(()=>{s==null||s.classList.add("transition")},50)},300)},customElements.define("slide-component",r),customElements.define("carousel-component",x),n.CarouselComponent=x,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})});
