// speech.js - Complete Audio Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAudioFeatures();
});

// ======================
// TEXT-TO-SPEECH (PLAYBACK)
// ======================

function speakReview(text) {
    if ('speechSynthesis' in window) {
        // Stop any current speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice
        utterance.rate = 0.9;  // Slightly slower than normal
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Select a pleasant voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = ['Google UK English Female', 'Microsoft Zira'];
        const voice = voices.find(v => preferredVoices.includes(v.name)) || voices[0];
        
        if (voice) utterance.voice = voice;
        
        // Speak with error handling
        try {
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Speech error:", error);
            alert("Error: Couldn't read the review. Try refreshing the page.");
        }
    } else {
        alert("Your browser doesn't support text-to-speech. Try Chrome or Edge.");
    }
}

// ======================
// AUDIO RECORDING
// ======================

let mediaRecorder;
let audioChunks = [];
let recordingStartTime;
let recordingInterval;

function initializeAudioFeatures() {
    // Setup Play Audio buttons
    document.querySelectorAll('.play-audio').forEach(btn => {
        btn.addEventListener('click', function() {
            const reviewText = this.closest('.card-body').querySelector('p').textContent;
            speakReview(reviewText);
        });
    });

    // Setup Recording Interface
    const recordBtn = document.getElementById('record-button');
    if (recordBtn) {
        recordBtn.addEventListener('click', startRecording);
        
        document.getElementById('stop-button').addEventListener('click', stopRecording);
        document.getElementById('play-button').addEventListener('click', playRecording);
        document.getElementById('save-button').addEventListener('click', saveRecording);
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                clearInterval(recordingInterval);
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                document.getElementById('play-button').disabled = false;
                document.getElementById('play-button').dataset.audioUrl = audioUrl;
                
                // For demo purposes - in production, upload to server
                console.log('Audio ready for playback:', audioUrl);
            };
            
            mediaRecorder.start();
            recordingStartTime = Date.now();
            updateRecordingTime(); // Initial call
            recordingInterval = setInterval(updateRecordingTime, 1000);
            
            // Update UI
            document.getElementById('record-button').style.display = 'none';
            document.getElementById('audio-controls').style.display = 'flex';
            
            // Accessibility announcement
            const liveRegion = document.getElementById('live-messages') || createLiveRegion();
            liveRegion.textContent = 'Recording started. Speak now.';
        })
        .catch(err => {
            console.error('Microphone error:', err);
            alert('Microphone access denied. Please enable permissions in your browser settings.');
        });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        // Accessibility announcement
        const liveRegion = document.getElementById('live-messages');
        if (liveRegion) liveRegion.textContent = 'Recording stopped.';
    }
}

function updateRecordingTime() {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('recording-time').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function playRecording() {
    const audioUrl = document.getElementById('play-button').dataset.audioUrl;
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
        
        // Accessibility announcement
        const liveRegion = document.getElementById('live-messages');
        if (liveRegion) liveRegion.textContent = 'Playing your recording.';
    }
}

function saveRecording() {
    // In production: Upload audioBlob to your server
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    
    // Demo - would be replaced with actual upload code
    console.log('Audio saved (simulated):', audioBlob);
    alert('Voice review saved! In a real app, this would upload to our servers.');
    
    resetAudioControls();
}

function resetAudioControls() {
    document.getElementById('record-button').style.display = 'block';
    document.getElementById('audio-controls').style.display = 'none';
    document.getElementById('play-button').disabled = true;
    document.getElementById('play-button').removeAttribute('data-audio-url');
    document.getElementById('recording-time').textContent = '0:00';
}

function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-messages';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    document.body.appendChild(liveRegion);
    return liveRegion;
}

// Load voices when available
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function() {
        console.log('Voices loaded:', window.speechSynthesis.getVoices());
    };
}