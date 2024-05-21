// Video Slider Swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// Other Video Swiper
var swiper2 = new Swiper(".mySwiper2", {
  cssMode: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
  mousewheel: true,
  keyboard: true,
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
}

function showSubmitButton() {
  submitButton.style.display = "block";
}

function hideMicButton() {
  micButton.style.display = "none";
}

function hideRecordText() {
  recordText.style.display = "none";
}

function hideSubmitButton() {
  submitButton.style.display = "none";
}

playPauseButton.addEventListener('click', playAndPause);

video.addEventListener('play', () => {
  playPauseButton.innerHTML = '<i class="fa-solid fa-pause"></i>';
  video.classList.add('playing');
  timeoutID = setTimeout(() => {
    video.pause();
    playPauseButton.style.display = "none";
    showMicButton();
    showRecordText();
    showSubmitButton();
  }, 20000); // 20 seconds
});

video.addEventListener('pause', () => {
  playPauseButton.innerHTML = '<i class="fa-solid fa-play"></i>';
  video.classList.remove('playing');
  clearTimeout(timeoutID);
});

micButton.addEventListener('click', recordSound);

let recorder;
let audioChunks = [];
let isRecording = false;

const audio = document.createElement("audio");
  container.querySelector('.record-container').appendChild(audio);

async function recordSound() {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = function(event) {
        audioChunks.push(event.data);
      };
      recorder.onstop = function() {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audio.controls = true;
        audio.src = audioUrl;
        audioChunks = [];  // Clear the audio chunks for the next recording
      };
      recorder.start();
      isRecording = true;
      micButton.classList.add('recording');
      recordText.textContent = "Sedang merekam...";
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  } else {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      isRecording = false;
      micButton.classList.remove('recording');
      recordText.textContent = "Tekan tombol microphone untuk merekam suara Anda";
    }
  }
}

const scoreBox = container.querySelector(".score-box");

function showScore(){
  scoreBox.style.display = "flex";
}

submitButton.addEventListener('click', submitSound);

function submitSound(){
  hideMicButton();
  hideRecordText();
  hideSubmitButton();
  // video.pause();
  audio.style.display = "none";
  showScore();
}
  }); 

// Scroll Reveal
ScrollReveal({
    distance: '30px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('#video-slider, #recommendation, #upload, #choose, #other',  { origin: 'bottom'});
