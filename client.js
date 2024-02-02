document.addEventListener('DOMContentLoaded', function() {
    var audioPlayer = document.getElementById('audioPlayer');
    var ws = new WebSocket('ws://localhost:8080');
    var isSyncMode = true; // Start in Sync mode

    // Function to handle state changes based on messages from the server
    function handleStreamState(state) {
        console.log('Handling stream state:', state);
        if (state === 'start-study') {
            audioPlayer.src = document.getElementById('soundSelection').value; 
            audioPlayer.play().catch(e => console.error('Playback failed:', e));
        } else if (state === 'start-break') {
            audioPlayer.pause();
        }
    }

    // When the WebSocket connection is open
    ws.onopen = function() {
        console.log('Connected to the server');
        // Request the current state as soon as the connection opens
        ws.send('request-current-state');
    };

    // Handling messages from the server
    ws.onmessage = function(event) {
        console.log('Message from server:', event.data);
        
        // Check if the received data dictates the state
        if (isSyncMode && (event.data === 'start-study' || event.data === 'start-break')) {
            handleStreamState(event.data);
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket Error:', error);
    };

    // Listener for the sound selection dropdown
    document.getElementById('soundSelection').addEventListener('change', function(event) {
        if (!isSyncMode) {
            audioPlayer.src = event.target.value;
            audioPlayer.play();
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
});
