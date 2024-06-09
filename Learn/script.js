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
submitButton.addEventListener('click', submitSound);
    
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

// submitButton.addEventListener('click', submitSound);
// submitButton.addEventListener('click', ()=>{
//     $.ajax({
//             url: '/run-function',
//             type: 'POST',
//             success: function(response){
//                 $("#result").html(response.message);
//             },
//             error: function(error){
//                 $("#result").html("Error: " + error.responseText);
//             }
//     });
// });
    

async function submitSound() {
        hideMicButton();
        hideRecordText();
        hideSubmitButton();
        // video.pause();
        audio.style.display = "none";
        showScore();

        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio_data', audioBlob, 'audio.wav');
        formData.append('reftext', 'Your reference text here'); // Add your reference text

        try {
            const response = await fetch('/ackaud', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            console.log('Server response:', result);
            // Handle the response from the server
        } catch (error) {
            console.error('Error:', error);
        }
    }
  }); 

//Progress bar
document.addEventListener("DOMContentLoaded", () => {
    let progressBar = document.getElementById('progress-bar');
    let width = 0;
    let targetWidth = 50; 
    let interval = setInterval(() => {
        if (width >= targetWidth) {
            clearInterval(interval);
        } else {
            width++;
            progressBar.style.width = width + '%';
            progressBar.textContent = width + '%';
        }
    }, 20); 
});

//riwayat

const nilaiElements = document.querySelectorAll('.nilai');

nilaiElements.forEach(element => {
    const value = parseInt(element.textContent.replace('%', ''));

    if (value < 50) {
        element.classList.add('red');
    } else {
        element.classList.add('green');
    }
});

//level 4 ganti video

const videoElement = document.getElementById('level4btn');
level4btn.addEventListener('click', () => {
  const videoplay = document.getElementById('videoplay');
  videoplay.src = '../video/video2.mp4';
  videoplay.load();
  videoplay.play();
  
  const submitButton = document.getElementById('submit');
  submit.addEventListener('click', () => {
    videoElement.classList.add('green');
  })
})


document.getElementById('submit').addEventListener('click', () => {
    const levelButtons = document.querySelectorAll('.level-button button');
    levelButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            button.classList.add('green');
        }
    });
});

const levelButtons = document.querySelectorAll('.level-button button');
levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        levelButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});
