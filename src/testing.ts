const carousel = document.querySelector('#carousel') as any

setTimeout(() => {
  console.log('added new slide')
  const track = document.querySelector('.carousel-track') as any
  console.log(track.innerHTML)
  let newSlide = document.createElement('slide-component')
  newSlide.textContent = '6'
  track.append(newSlide)
  // carousel.setAttribute('autoplay', '2000')
  // carousel.setAttribute('wraparound', 'false')
}, 3000);

carousel!.breakpoints = {
  1200: {
    slidesToScroll: 3,
    slidesToShow: 3
  },
  0: {
    slidesToScroll: 1,
    slidesToShow: 1
  },
}