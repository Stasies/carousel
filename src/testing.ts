const carousel = document.querySelector("#carousel") as any;
const button = document.querySelector("#button") as HTMLButtonElement;
button.addEventListener("click", () => handleClick());
const handleClick = () => {
  console.log("clicked");
  carousel.next();
};
// carousel.next();

// setTimeout(() => {
//   const track = document.querySelector(".carousel-track") as any;
//   let newSlide = document.createElement("slide-component");
//   newSlide.textContent = "6";
//   track.append(newSlide);
//   console.log("added new slide");
//   // carousel.setAttribute('autoplay', '2000')
//   // carousel.setAttribute('wraparound', 'false')
// }, 3000);

carousel!.breakpoints = {
  1200: {
    slidesToScroll: 1,
    slidesToShow: 1.2,
  },
  0: {
    slidesToScroll: 1,
    slidesToShow: 1,
  },
};
