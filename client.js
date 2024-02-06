document.addEventListener('DOMContentLoaded', function() {
    var audioPlayer = document.getElementById('audioPlayer');
    var playSoundButton = document.getElementById('playSoundButton');
    var ws = new WebSocket('ws://localhost:8080');

    var isSyncMode = true;
    var isMobile = /Mobi|Android/i.test(navigator.userAgent);

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

    function handleMobilePlay() {
        if (audioPlayer.src) {
            audioPlayer.play().catch(e => console.error('Playback failed:', e));
        }
    }

    ws.onopen = function() {
        console.log('Connected to the server');
        ws.send('request-current-state');
    };

    ws.onmessage = function(event) {
        console.log('Message from server:', event.data);
        if (isSyncMode) {
            handleStreamState(event.data);
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket Error:', error);
    };

    document.getElementById('soundSelection').addEventListener('change', function(event) {
        if (!isSyncMode) {
            audioPlayer.src = event.target.value;
            if (!isMobile) {
                audioPlayer.play();
            }
        }
    });

    document.getElementById('syncModeButton').addEventListener('click', function() {
        isSyncMode = true;
        ws.send('request-current-state');
    });

    document.getElementById('manualModeButton').addEventListener('click', function() {
        isSyncMode = false;
        document.getElementById('soundSelection').disabled = false;
    });

    if (playSoundButton) {
        playSoundButton.addEventListener('click', handleMobilePlay);
    }
});

