// Web Speech API integration for audio reviews
let mediaRecorder;
let audioChunks = [];
let recordingStartTime;
let recordingInterval;

document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('record-button');
    const stopButton = document.getElementById('stop-button');
    const playButton = document.getElementById('play-button');
    const saveButton = document.getElementById('save-button');
    const audioControls = document.getElementById('audio-controls');
    const recordingTime = document.getElementById('recording-time');
    
    if (recordButton) {
        recordButton.addEventListener('click', startRecording);
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', stopRecording);
    }
    
    if (playButton) {
        playButton.addEventListener('click', playRecording);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', saveRecording);
    }
    
    // Check for microphone access
    navigator.permissions && navigator.permissions.query({ name: 'microphone' }).then(permissionStatus => {
        permissionStatus.onchange = () => {
            console.log('Microphone permission state has changed to ', permissionStatus.state);
        };
    });
});

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
            };
            
            mediaRecorder.start();
            recordingStartTime = Date.now();
            recordingInterval = setInterval(updateRecordingTime, 1000);
            
            document.getElementById('record-button').style.display = 'none';
            document.getElementById('audio-controls').style.display = 'block';
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please ensure you have granted microphone permissions.');
        });
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

function updateRecordingTime() {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('recording-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function playRecording() {
    const audioUrl = document.getElementById('play-button').dataset.audioUrl;
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }
}

function saveRecording() {
    // In a real app, this would upload the audio to your server
    alert('Audio review saved! In a real app, this would be uploaded to the server.');
    resetAudioControls();
}

function resetAudioControls() {
    document.getElementById('record-button').style.display = 'inline-block';
    document.getElementById('audio-controls').style.display = 'none';
    document.getElementById('play-button').disabled = true;
    document.getElementById('play-button').removeAttribute('data-audio-url');
    document.getElementById('recording-time').textContent = '0:00';
}