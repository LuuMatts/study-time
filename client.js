document.addEventListener('DOMContentLoaded', function() {
    var audioPlayer = document.getElementById('audioPlayer');
    var playSoundButton = document.getElementById('playSoundButton'); // Reference to the play button
    // Use 'wss' for secure WebSocket connections
    var ws = new WebSocket('ws://localhost:8080');

    var isSyncMode = true; // Start in Sync mode
    var isMobile = /Mobi|Android/i.test(navigator.userAgent); // Detect mobile devices

    // Function to handle state changes based on messages from the server
    function handleStreamState(state) {
        console.log('Handling stream state:', state);
        if (state === 'start-study') {
            audioPlayer.src = document.getElementById('soundSelection').value;
            if (!isMobile) {
                audioPlayer.play().catch(e => console.error('Playback failed:', e));
            }
        } else if (state === 'start-break') {
            audioPlayer.pause();
        }
    }

    // Function to handle playing audio on mobile devices
    function handleMobilePlay() {
        if (audioPlayer.src) {
            audioPlayer.play().catch(e => console.error('Playback failed:', e));
        }
    }

    // When the WebSocket connection is open
    ws.onopen = function() {
        console.log('Connected to the server');
        // Now it's safe to send a message
        ws.send('request-current-state');
        

    // Handling messages from the server
    ws.onmessage = function(event) {
        // Check if the received data is a blob
        if (event.data instanceof Blob) {
            // Create a FileReader to read the Blob as text
            var reader = new FileReader();
            reader.onload = function() {
                var messageText = reader.result;
                console.log('Message from server:', messageText);
                
                // Now you can handle the text as before
                if (isSyncMode && (messageText === 'start-study' || messageText === 'start-break')) {
                    handleStreamState(messageText);
                }
            };
            reader.readAsText(event.data);
        } else {
            // If event.data is already a text string, handle as before
            console.log('Message from server:', event.data);
            if (isSyncMode && (event.data === 'start-study' || event.data === 'start-break')) {
                handleStreamState(event.data);
            }
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket Error:', error);
    };

    // Listener for the sound selection dropdown
    document.getElementById('soundSelection').addEventListener('change', function(event) {
        if (!isSyncMode) {
            audioPlayer.src = event.target.value;
            if (!isMobile) {
                audioPlayer.play();
            }
        }
    });

    // Listener for the "Sync to Stream" button
    document.getElementById('syncModeButton').addEventListener('click', function() {
        isSyncMode = true;
        console.log('Attempting to sync to current stream state...');
        // Request the current state to sync the audio
        ws.send('request-current-state');
    });

    // Listener for the "Manual Control" button
    document.getElementById('manualModeButton').addEventListener('click', function() {
        isSyncMode = false;
        // Enable the sound selection dropdown for manual control
        document.getElementById('soundSelection').disabled = false;
    });

    // Listener for the "Play Sound" button - specific for mobile devices
    if (playSoundButton) { // Check if the button exists
        playSoundButton.addEventListener('click', handleMobilePlay);
    }
});
