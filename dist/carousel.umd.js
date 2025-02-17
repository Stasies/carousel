(function(n,r){typeof exports=="object"&&typeof module<"u"?r(exports):typeof define=="function"&&define.amd?define(["exports"],r):(n=typeof globalThis<"u"?globalThis:n||self,r(n.carousel={}))})(this,function(n){"use strict";var O=Object.defineProperty;var S=n=>{throw TypeError(n)};var A=(n,r,a)=>r in n?O(n,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[r]=a;var l=(n,r,a)=>A(n,typeof r!="symbol"?r+"":r,a),N=(n,r,a)=>r.has(n)||S("Cannot "+a);var y=(n,r,a)=>r.has(n)?S("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(n):r.set(n,a);var s=(n,r,a)=>(N(n,r,"access private method"),a);var e,b,m,I,T,k,L,w,E,u,p,c,C,M,g;class r extends HTMLElement{constructor(){super();l(this,"rendered");this.rendered=!1}connectedCallback(){this.render()}render(){if(this.rendered)return;const t=document.createElement("div");t.classList.add("slide"),Array.from(this.childNodes).forEach(o=>{t.appendChild(o.cloneNode(!0))}),this.replaceWith(t),this.rendered=!0}}function a(d){if(console.log("checking"),console.log(typeof d),typeof d!="object"||d===null)return console.log("1"),"invalid value type. Breakpoints should be an object";for(const f in d){if(isNaN(Number(f)))return console.log("2"),"Breakpoints should contain keys typeof number";const t=d[f];if(typeof t!="object"||t===null||t.slidesToShow&&typeof t.slidesToShow!="number"||t.slidesToScroll&&typeof t.slidesToScroll!="number")return console.log("3"),"invalid value type. Pass an object with keys itemsToShow and itemsToScroll and values typeof number"}return console.log("4"),!1}class x extends HTMLElement{constructor(...t){super();y(this,e);l(this,"observer",null);l(this,"slides");l(this,"initialSlides");l(this,"rendered");l(this,"config");l(this,"autoplay");l(this,"wraparound");l(this,"_currentIndex");l(this,"_breakpoints");l(this,"maxIndex");l(this,"slidesToShow");l(this,"slideCount");l(this,"slidesToScroll");l(this,"slideWidth");l(this,"isDragging");l(this,"startX");l(this,"dragOffset");l(this,"interval");this.initialSlides=[],this.rendered=!1,this._breakpoints={},this.autoplay=!1,this.wraparound=!1,this.slides=[],this.interval=null,this.slideWidth=100,this.slideCount=0,this._currentIndex=0,this.maxIndex=0,this.slidesToShow=1,this.slidesToScroll=1,this.isDragging=!1,this.startX=0,this.dragOffset=0}static get observedAttributes(){return["autoplay","wraparound","breakpoints"]}attributeChangedCallback(t,i,o){switch(console.log(`Attribute ${t} changed from ${i} to ${o}`),t){case"autoplay":this.autoplay=parseInt(o,10)||!1,this.startAutoPlay();break;case"wraparound":this.wraparound=o.match(/true|false/)?JSON.parse(o):!1;break}}set breakpoints(t){a(t)||(this._breakpoints=t),this.updateBreakpoints()}get breakpoints(){return this._breakpoints}updateBreakpoints(){s(this,e,T).call(this),s(this,e,m).call(this)}get currentIndex(){return this._currentIndex}set currentIndex(t){this._currentIndex=Math.min(Math.max(t,0),this.maxIndex),s(this,e,C).call(this),s(this,e,M).call(this),console.log(this.currentIndex)}connectedCallback(){s(this,e,b).call(this),this.observeSlides(),s(this,e,m).call(this),s(this,e,w).call(this)}disconnectedCallback(){s(this,e,E).call(this)}render(){var o;this.innerHTML="";const t=document.createElement("div");t.classList.add("carousel");const i=document.createElement("div");i.classList.add("carousel-track","transition"),(o=this.slides)==null||o.forEach(h=>i.appendChild(h)),t.appendChild(i),this.appendChild(t)}observeSlides(){const t=(i,o)=>{for(const h of i)h.type==="childList"&&h.addedNodes.forEach(v=>{v.classList&&v.classList.contains("slide")&&(this.initialSlides.push(v),s(this,e,m).call(this))})};this.observer=new MutationObserver(t),this.observer.observe(this,{childList:!0,subtree:!0})}startAutoPlay(){this.autoplay&&(this.interval=setInterval(()=>this.next(),this.autoplay))}stopAutoPlay(){clearInterval(this.interval)}handleNonInfiniteScroll(t){this.currentIndex+=t,this.maxIndex==this.currentIndex&&this.stopAutoPlay()}prev(){if(!this.wraparound){this.handleNonInfiniteScroll(-this.slidesToScroll);return}this.currentIndex<=1?(this.currentIndex-=this.slidesToScroll,s(this,e,g).call(this,this.currentIndex+this.slideCount)):this.currentIndex-=this.slidesToScroll}next(){if(!this.wraparound){this.handleNonInfiniteScroll(this.slidesToScroll);return}const t=this.slideCount-this.slidesToScroll;this.currentIndex>=t?(this.currentIndex+=this.slidesToScroll,s(this,e,g).call(this,this.currentIndex-this.slideCount)):this.currentIndex+=this.slidesToScroll}jump(t){this.currentIndex=t+Math.floor(this.slidesToShow)}}e=new WeakSet,b=function(){const t=document.createElement("style");t.textContent=`
    carousel-component{
      display: block;
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
      gap: 8px;
    }
    .transition {
      transition: transform 0.3s ease;
    }
    .slide{
      height: 100%;
      flex: 0 0 auto;
      box-sizing: border-box;
    }
    `,document.head.appendChild(t)},m=function(){console.log("initialising"),s(this,e,I).call(this),this.render(),s(this,e,k).call(this),s(this,e,L).call(this)},I=function(){this.querySelector(".carousel-track")||(this.initialSlides=Array.from(this.children)),this.slideCount=this.initialSlides.length;const i=this.initialSlides.slice(0,Math.floor(this.slidesToShow)).map(h=>h.cloneNode(!0)),o=this.initialSlides.slice(-Math.floor(this.slidesToShow)).map(h=>h.cloneNode(!0));this.slides=this.wraparound?[...o,...this.initialSlides,...i]:this.initialSlides},T=function(){for(let t in this.breakpoints)window.innerWidth>=+t&&(this.slidesToShow=this.breakpoints[+t].slidesToShow||1,this.slidesToScroll=this.breakpoints[+t].slidesToScroll||this.breakpoints[+t].slidesToShow||1)},k=function(){var t;this.slideWidth=100/this.slidesToShow,(t=this.slides)==null||t.forEach(i=>{i.setAttribute("style",`width: ${this.slideWidth}%`)})},L=function(){this.maxIndex=this.wraparound?this.slideCount:Math.max(this.slideCount-this.slidesToShow,0),this.currentIndex=this.wraparound?Math.floor(this.slidesToShow):0},w=function(){this.addEventListener("mousedown",s(this,e,u)),this.addEventListener("touchstart",s(this,e,u),{passive:!0}),this.addEventListener("mousemove",s(this,e,p)),this.addEventListener("touchmove",s(this,e,p),{passive:!0}),this.addEventListener("mouseup",s(this,e,c)),this.addEventListener("mouseleave",s(this,e,c)),this.addEventListener("touchend",s(this,e,c)),window.addEventListener("resize",()=>this.updateBreakpoints()),this.startAutoPlay(),this.addEventListener("mouseenter",()=>this.stopAutoPlay()),this.addEventListener("mouseleave",()=>this.startAutoPlay())},E=function(){this.removeEventListener("mousedown",s(this,e,u)),this.removeEventListener("touchstart",s(this,e,u)),this.removeEventListener("mousemove",s(this,e,p)),this.removeEventListener("touchmove",s(this,e,p)),this.removeEventListener("mouseup",s(this,e,c)),this.removeEventListener("mouseleave",s(this,e,c)),this.removeEventListener("touchend",s(this,e,c))},u=function(t){this.stopAutoPlay(),this.slidesToScroll=1,this.isDragging=!0,this.startX=t instanceof MouseEvent?t.clientX:t.touches[0].clientX,this.dragOffset=0},p=function(t){if(!this.isDragging)return;const i=t instanceof MouseEvent?t.clientX:t.touches[0].clientX;this.dragOffset=i-this.startX,(this.currentIndex>=this.maxIndex&&this.dragOffset<0||this.currentIndex<=0&&this.dragOffset>0)&&(this.dragOffset=0);const o=this.querySelector(".carousel-track");o&&(o.style.transform=`translateX(calc(-${this.currentIndex*this.slideWidth}% + ${this.dragOffset}px))`)},c=function(){if(!this.isDragging)return;this.isDragging=!1;const t=this.slideWidth/3;Math.abs(this.dragOffset)>t&&(this.dragOffset<0?this.next():this.currentIndex>0&&this.prev())},C=function(){let t=this.querySelector(".carousel-track");t.style.transform=`translateX(-${this.currentIndex*this.slideWidth}%)`},M=function(){var t;(t=this.slides)==null||t.forEach((i,o)=>{i instanceof HTMLElement&&(i.classList.remove("prev","current","next","hidden"),o===this.currentIndex?i.classList.add("current"):o===this.currentIndex-1?i.classList.add("prev"):o===this.currentIndex+1&&i.classList.add("next"),(o<this.currentIndex-1||o>this.currentIndex+this.slidesToShow)&&i.classList.add("hidden"))})},g=function(t){let i=this.querySelector(".carousel-track");setTimeout(()=>{i==null||i.classList.remove("transition"),this.currentIndex=t,setTimeout(()=>{i==null||i.classList.add("transition")},50)},300)},customElements.define("slide-component",r),customElements.define("carousel-component",x),n.CarouselComponent=x,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})});
