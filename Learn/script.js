// Login Form

let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () =>{
    loginForm.classList.toggle('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar');

// Menu Icon

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    loginForm.classList.remove('active');
}

// Scroll

window.onscroll = () =>{
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

// Swiper

var swiper = new Swiper(".product-slider", {
    loop:true,
    spaceBetween: 20,
    autoplay: {
        delay: 5500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1020: {
        slidesPerView: 3,
      },
    },
});

var swiper = new Swiper(".review-slider", {
    loop:true,
    spaceBetween: 20,
    autoplay: {
        delay: 6500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1020: {
        slidesPerView: 3,
      },
    },
});

// Scroll Reveal

const scroll = ScrollReveal({
  distance: "100px",
  duration: 2500,
  // reset: true,
});

scroll.reveal(`#level`, {
  origin: "top",
  interval: 100,
});

scroll.reveal(`#history`, {
  origin: "left",
});

scroll.reveal(`#video`, {
  origin: "bottom",
});

// Custom Video Player
document.querySelectorAll('.video-container').forEach(container => {
const video = container.querySelector("video");
const playPauseButton = container.querySelector(".btn-toggle");
const micButton = container.querySelector(".mic-btn");
const recordText = container.querySelector(".record-text");
const submitButton = container.querySelector(".submit-btn");

function playAndPause() {
  if (video.paused) {
    video.play();
    playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
    video.classList.add('playing');
  } else {
    video.pause();
    playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
    video.classList.remove('playing');
  }
}

function showMicButton() {
  micButton.style.display = "block";
}

function showRecordText() {
  recordText.style.display = "block";
