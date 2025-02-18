const carousel = document.querySelector('#carousel') as any
const nextButton = document.querySelector('#next')
const prevButton = document.querySelector('#prev')
prevButton?.addEventListener('click', () => carousel.prev())
nextButton?.addEventListener('click', () => carousel.next())
document.addEventListener("DOMContentLoaded", function (event) {
  //do work
  carousel.breakpoints = {
    1200: {
      slidesToShow: 4,
      slidesToScroll: 1
    },
    0: {
      slidesToShow: 2,
      slidesToScroll: 2
    }
  };
});

