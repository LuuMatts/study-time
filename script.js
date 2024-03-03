document.addEventListener('DOMContentLoaded', () => {
  let countdown;
  const audioPlayer = document.getElementById('audioPlayer');
  const soundOptions = document.getElementById('soundOptions');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  const startButton = document.getElementById('start');
  const pauseButton = document.getElementById('pause');
  const resetButton = document.getElementById('reset');
  const sessionInput = document.getElementById('sessionInput');
  const breakInput = document.getElementById('breakInput');
  const incrSession = document.getElementById('incrSession');
  const decrSession = document.getElementById('decrSession');
  const incrBreak = document.getElementById('incrBreak');
  const decrBreak = document.getElementById('decrBreak');

  const soundBackgrounds = {
    'sounds/Rain.MP3': 'url(gifs/rain.gif)',
    'sounds/Fire.MP3': 'url(gifs/fireplace.gif)',
    'sounds/ASMR.MP3': 'url(gifs/asmr.gif)',
    'sounds/Nature Sound.MP3': 'url(gifs/nature.gif)',
    'sounds/White Noise.MP3': 'url(gifs/noise.gif)',
    'sounds/Break.MP3': 'url(gifs/relax.gif)',
    // Add more sounds and their corresponding backgrounds here
  };
  

  
  let isRunning = false;
  let isSession = true;
  let sessionLength = parseInt(sessionInput.value) * 60;
  let breakLength = parseInt(breakInput.value) * 60;
  let currentTime = sessionLength;



  function switchTimer() {
    //console.log('Switching timer'); // This should appear in the console.
    isSession = !isSession; // Toggle between session and break
    currentTime = isSession ? sessionLength : breakLength; // Set the correct time
    updateTimerDisplay(currentTime);

    // Update the title to reflect the current state
    const titleElement = document.getElementById('title');
    const backgroundContainer = document.getElementById('gif-background-container');
    const selectedSound = document.getElementById('soundOptions').value;
    titleElement.textContent = isSession ? 'Study!' : 'Break!';

    if (!isSession) {
      // If transitioning to a break, set break sound and gif, then play
      audioPlayer.src = 'sounds/Break.MP3'; // Adjust to your actual break sound file
      backgroundContainer.style.backgroundImage = soundBackgrounds['sounds/Break.MP3'] || ''; // Adjust to your actual break gif
      audioPlayer.play();
  } else {
      // If transitioning back to study, do not automatically start the next session
      // Reset to "Ready?" state and wait for user to press "Start"
      titleElement.textContent = 'Study!';
      audioPlayer.src = selectedSound;
      backgroundContainer.style.backgroundImage = soundBackgrounds[selectedSound] || 'none';
      audioPlayer.play();
  }

  // Clear existing interval
  clearInterval(countdown);
  isRunning = false; // Ensure timer is considered not running
}

  function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
  }

  function updateTimer() {
    if (currentTime > 0) {
        currentTime--;
        updateTimerDisplay(currentTime);
    } else {
        clearInterval(countdown);
        switchTimer();
        countdown = setInterval(updateTimer, 1000);  // Restart the timer with the new current time
    }
}


startButton.addEventListener('click', () => {
  if (!isRunning) {
      const selectedSound = document.getElementById('soundOptions').value;
      const backgroundContainer = document.getElementById('gif-background-container'); // Ensure the correct ID
      const clouds = document.getElementById('cloud-intro');
      // Set the background based on the selected sound
      backgroundContainer.style.backgroundImage = soundBackgrounds[selectedSound] || 'none';
      // Ensure the background container is visible if previously hidden
      backgroundContainer.style.display = 'block';
      // Hide clouds
      clouds.classList.add('hidden');
      
      // Set and play the selected audio
      audioPlayer.src = selectedSound;
      audioPlayer.play().catch(e => console.log('Audio playback failed:', e));
      
      // Start your timer
      countdown = setInterval(updateTimer, 1000);
      isRunning = true;
      
      // Optionally update UI elements, e.g., changing title to "Study!"
      document.getElementById('title').textContent = 'Study!';
  }
});


resetButton.addEventListener('click', () => {
  clearInterval(countdown);
  currentTime = sessionLength;
  updateTimerDisplay(currentTime);
  isRunning = false;
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  const titleElement = document.getElementById('title');
  titleElement.textContent = 'Ready?'; // Set the title back to "Ready?"
  document.body.style.backgroundImage = ''; // Clear the GIF background
  document.getElementById('cloud-intro').classList.remove('hidden'); // Show clouds when timer resets
});

pauseButton.addEventListener('click', () => {
  clearInterval(countdown);
  isRunning = false;
  audioPlayer.pause();
  const titleElement = document.getElementById('title');
  titleElement.textContent = 'Ready?'; // Set the title back to "Ready?"
  
  // Hide the GIF background container
  const backgroundContainer = document.getElementById('gif-background-container');
  backgroundContainer.style.display = 'none';
  
  // Reset the body's background to the normal gradient
  document.body.style.backgroundImage = '';

  // Show clouds when timer pauses
  document.getElementById('cloud-intro').classList.remove('hidden');
});



  incrSession.addEventListener('click', () => {
    if (!isRunning) {
        sessionLength = Math.min(sessionLength + 60, 120 * 60);
        currentTime = sessionLength;
        sessionInput.value = sessionLength / 60;
        updateTimerDisplay(currentTime);
    }
});

decrSession.addEventListener('click', () => {
    if (!isRunning) {
        sessionLength = Math.max(sessionLength - 60, 60);
        currentTime = sessionLength;
        sessionInput.value = sessionLength / 60;
        updateTimerDisplay(currentTime);
    }
});

incrBreak.addEventListener('click', () => {
    breakLength = Math.min(breakLength + 60, 60 * 60);
    breakInput.value = breakLength / 60;
});

decrBreak.addEventListener('click', () => {
    breakLength = Math.max(breakLength - 60, 60);
    breakInput.value = breakLength / 60;
});

  sessionInput.addEventListener('change', (e) => {
    sessionLength = parseInt(e.target.value) * 60;
    if (!isRunning) {
      currentTime = sessionLength;
      updateTimerDisplay(currentTime);
    }
  });

  breakInput.addEventListener('change', (e) => {
    breakLength = parseInt(e.target.value) * 60;
  });

  document.getElementById('soundOptions').addEventListener('change', function() {
});
  
  // Initialize
  updateTimerDisplay(sessionLength);
});

const audioPlayer = document.getElementById('audioPlayer');
const soundOptions = document.getElementById('soundOptions');