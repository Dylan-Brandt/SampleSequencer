import WaveSurfer from 'https://unpkg.com/wavesurfer.js@beta';
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@beta/dist/plugins/regions.js';
import audiobufferToWav from 'https://cdn.jsdelivr.net/npm/audiobuffer-to-wav@1.0.0/+esm';
import * as Tone from 'https://cdn.jsdelivr.net/npm/tone@14.7.77/+esm';

// Select the necessary elements
window.onload = () => {
    const uploadSampleButton = document.getElementById('uploadSampleButton');
    const recordSampleButton = document.getElementById('recordSampleButton');
    const stopSampleButton = document.getElementById('stopSampleButton');
    const playSampleButton = document.getElementById('playSampleButton');
    const downloadSampleButton = document.getElementById('downloadSampleButton');
    const addSampleButton = document.getElementById('addSampleButton');
    const playTrackButton = document.getElementById('playTrackButton');
    const stopTrackButton = document.getElementById('stopTrackButton');
    const downloadTrackButton = document.getElementById('downloadTrackButton');
    const trackBPM = document.getElementById('trackBPM');
    const sampleGain = document.getElementById('sampleGain');
    const sampleDistortion = document.getElementById('sampleDistortion');

    // Add event listeners
    uploadSampleButton.addEventListener('click', uploadSample);
    recordSampleButton.addEventListener('click', startRecording);
    stopSampleButton.addEventListener('click', stopRecording);
    playSampleButton.addEventListener('click', playRecording);
    downloadSampleButton.addEventListener('click', downloadRegion);
    addSampleButton.addEventListener('click', addSampleToRoll);
    playTrackButton.addEventListener('click', playTrack);
    stopTrackButton.addEventListener('click', stopTrack);
    trackBPM.addEventListener('change', updateBPM);
    downloadTrackButton.addEventListener('click', downloadTrack);
    sampleGain.addEventListener('change', updateEffects);
    sampleDistortion.addEventListener('change', updateEffects);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let region;
let mediaRecorder;

let samplerPlayer = new Tone.Player();
let samplerBuffer = new Tone.ToneAudioBuffer();
let gain = new Tone.Gain(0);
let distortion = new Tone.Distortion(0);

let wavesurfer;
let wsRegions;

// Set up wavesurfer instance
function configureWavesurfer() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true,
        waveColor: 'white',
        sampleRate: audioCtx.sampleRate
    });

    wavesurfer.on('ready', () => {
        wsRegions.clearRegions();
        region = wsRegions.addRegion({
            start: 0,
            end: wavesurfer.getDuration(),
            color: "rgba(184, 134, 11, 0.25)"
        });
    })
    wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());
    
    wsRegions.on('region-clicked', (region, e) => {
        e.stopPropagation();
        region.play();
        wavesurfer.on('audioprocess', autoStopRegionPlay);
    });
}

// Reset wavesurfer and clear cache
function resetWavesurfer() {
    wavesurfer.destroy();
    wavesurfer = null;
    configureWavesurfer();
}

configureWavesurfer();

function uploadSample() {
    resetWavesurfer();
    // Create an input element of type "file"
    let fileInput = document.createElement('input');
    fileInput.type = 'file';

    // Trigger click event on the file input
    fileInput.click();

    // Listen for file selection
    fileInput.addEventListener('change', function(event) {
        let file = event.target.files[0];
        
        // Check if the file is of type .wav or .mp3
        if (file.type === 'audio/wav' || file.type === 'audio/mp3' || file.type === 'audio/webm') {
            // Use the Wavesurfer.js load method to load the file
            let url = URL.createObjectURL(file);
            samplerBuffer.load(url);
            samplerPlayer.load(url);
            document.getElementById('effectsControl').style.display = 'flex';
            wavesurfer.load(url).then(() => {
                document.getElementById('sampleName').value = file.name.replace(/\.[^/.]+$/, "");
                stopSampleButton.disabled = true;
                playSampleButton.disabled = false;
                recordSampleButton.disabled = false;
                downloadSampleButton.disabled = false;
                addSampleButton.disabled = false;
            });
            URL.revokeObjectURL(url);
        } 
        else {
            // Alert the user if the file type is not supported
            alert('Invalid file format. Please select a .wav or .mp3 file.');
        }
    });
}

// Function to handle start button click
function startRecording() {
    resetWavesurfer();
    let chunks = [];
    let trackDuration;
    const startTime = Date.now();
    
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(stream) {
        // Create a new MediaRecorder instance with the stream
        mediaRecorder = new MediaRecorder(stream);

        // Set up event handlers
        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function() {
            // Convert the recorded chunks into a single Blob
            const recordedBlob = new Blob(chunks, { type: 'audio/webm' });

            // Get the length of the audio clip
            const endTime = Date.now();
            trackDuration = Math.abs(endTime - startTime) / 1000;

            // Set the audio element's source to the recorded audio
            let url = URL.createObjectURL(recordedBlob);
            samplerBuffer.load(url);
            samplerPlayer.load(url);
            document.getElementById('effectsControl').style.display = 'flex';
            wavesurfer.load(url);

            // Enable the play button
            playSampleButton.disabled = false;

            // Clear the chunks array
            chunks = [];

            URL.revokeObjectURL(url);
        };

    // Start recording
    mediaRecorder.start();

    // Disable start button and enable stop button
    recordSampleButton.disabled = true;
    stopSampleButton.disabled = false;
    downloadSampleButton.disabled = true;
    addSampleButton.disabled = true;
    })
    .catch(function(err) {
    console.error('Error accessing the microphone: ', err);
    });
}

// Function to handle stop button click
function stopRecording() {
    // Stop recording
    mediaRecorder.stop();

    // Disable stop button and enable start button
    stopSampleButton.disabled = true;
    recordSampleButton.disabled = false;
    downloadSampleButton.disabled = false;
    addSampleButton.disabled = false;
}

// Function to handle play button click
function playRecording() {
    wavesurfer.play();
}

// Function to stop audio when trimmed audio finishes playing
function autoStopRegionPlay() {
    if (wavesurfer.getCurrentTime() >= region.end) {
        wavesurfer.stop();
        wavesurfer.un('audioprocess', autoStopRegionPlay);
    }
}

// Create a wav encoded URL for trimmed audio clip
function getRegionURL() {
    // Get the selected region's start and end times
    const startTime = region.start;
    const endTime = region.end;

    let sourceBuffer = wavesurfer.getDecodedData();
    let destinationBuffer = audioCtx.createBuffer(1, Math.round(audioCtx.sampleRate * (endTime - startTime)), audioCtx.sampleRate);

    sourceBuffer.copyFromChannel(destinationBuffer.getChannelData(0), 0, sourceBuffer.sampleRate * startTime);

    // Create a new WAV file from the destination buffer
    let wavFile = audiobufferToWav(destinationBuffer);

    let blob = new window.Blob([ new DataView(wavFile) ], {
        type: 'audio/wav'
    });

    return window.URL.createObjectURL(blob);
}

// Download a wav file of the trimmed audio clip
function downloadRegion() {
    let url = getRegionURL();
    let anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = document.getElementById('sampleName').value ? document.getElementById('sampleName').value + '.wav' : 'sample.wav';
    anchor.click();
    window.URL.revokeObjectURL(url);
}

// Listener for slider change on Tone.js effects for samples
function updateEffects() {
    let player;
    let gain;
    let distortion;
    let regionStart = region.start;
    let regionEnd = region.end;
    resetWavesurfer(); // Clear cache

    // Render effect change using offline context
    Tone.Offline(() => {
        player = new Tone.Player(samplerBuffer).toDestination();
        gain = new Tone.Gain(sampleGain.value).toDestination();
        distortion = new Tone.Distortion(sampleDistortion.value).toDestination();
        console.log(sampleGain.value);
        console.log(sampleDistortion.value);
        player.chain(gain, distortion);
        player.start(0);
    }, samplerBuffer.duration).then((buffer) => {

        let wavFile = audiobufferToWav(buffer);
        let blob = new window.Blob([ new DataView(wavFile) ], {
            type: 'audio/wav'
        });
        let url = window.URL.createObjectURL(blob);

        // Load effect change into wavesurfer
        wavesurfer.load(url).then(() => {
            URL.revokeObjectURL(url);
            player.dispose();
            gain.dispose();
            // Preserve audio trimming
            region.setOptions({
                start: regionStart,
                end: regionEnd,
            });
        });
    });
}

let samples = []; // Array of samples as Tone.js Players
let sampleBuffers = []; // Array of samples as ToneAudioBuffers
let scheduleIds = []; // IDs for sequencer events

let seqColumns; // Columns of the sequencer
let seqNotes; // Sequencer notes
let numSamples; // Number of samples

let curNote = 0; // Current note when sequencer is playing

// Setup the transport
Tone.Transport.set({
    bpm: 120,
    loop: true,
    loopStart: 0,
    loopEnd: "4m",
    timeSignature: 4
});

// Toggle a note in the sequencer
function toggleNote(button) {
    if(button.getAttribute('active') === null) {
        button.setAttribute('active', '');
        button.style.backgroundColor = 'black';
    }
    else {
        button.removeAttribute('active', '');
        button.style.backgroundColor = 'white';
    };
}

// Add trimmed audio clip to sequencer roll
function addSampleToRoll() {
    seqColumns = document.querySelectorAll('div.seq-column');
    playTrackButton.disabled = false;
    downloadTrackButton.disabled = false;

    seqColumns.forEach((currentValue, index) => {
        if(index == 0) {
            // Sample title
            let label = document.createElement('span');
            label.innerHTML = document.getElementById('sampleName').value ? document.getElementById('sampleName').value : (samples.length + 1).toString();
            currentValue.appendChild(label);
        }
        else if(index == seqColumns.length - 2) {
            // Mute sample button
            let muteButton = document.createElement('button');
            let icon = document.createElement('img');
            muteButton.classList.add('muteSample');
            muteButton.addEventListener('click', () => {
                muteSample(muteButton);
            });
            icon.src = '../resources/images/icons8-mute-48.png';
            icon.style.height = '25px';
            icon.style.width = '25px';
            muteButton.appendChild(icon);
            currentValue.appendChild(muteButton);
        }
        else if(index == seqColumns.length - 1) {
            // Delete sample button
            let deleteButton = document.createElement('button');
            let icon = document.createElement('img');
            deleteButton.classList.add('deleteSample');
            deleteButton.addEventListener('click', () => {
                deleteSample(deleteButton);
            });
            icon.src = '../resources/images/icons8-delete-30.png';
            icon.style.height = '25px';
            icon.style.width = '25px';
            deleteButton.appendChild(icon);
            currentValue.appendChild(deleteButton);
        }
        else {
            // Add sequence buttons
            let button = document.createElement('button');
            button.className = 'seq-note';
            button.addEventListener('click', () => {
                toggleNote(button);
            });
            currentValue.appendChild(button);
            scheduleIds.push(null);
        }
    });

    let url = getRegionURL();
    samples.push(new Tone.Player(url).toDestination());
    sampleBuffers.push(new Tone.ToneAudioBuffer(url));

    seqNotes = document.querySelectorAll('.seq-note');
    numSamples = seqNotes.length / 16;

    URL.revokeObjectURL(url);
}

// Function to schedule and play active notes
function playTrack() {
    let noteIndex;
    let currentSample;
    let currentBeat;

    scheduleIds.push(Tone.Transport.scheduleRepeat((time) => {
        if(curNote > 15) {
            curNote = 0;
        }
        for(let i = 0; i < numSamples; i++) {
            noteIndex = curNote * numSamples + i;
            currentSample = noteIndex % numSamples;
            currentBeat = Math.floor(noteIndex/numSamples);
            // // Play sample if it is activated
            if(seqNotes[noteIndex].getAttribute('active') != null && seqNotes[noteIndex].getAttribute('muted') == null) {
                samples[currentSample].start(time);
            }
            // Visualize sequence state
            seqColumns[currentBeat].style['background-color'] = 'gray';
            seqColumns[currentBeat + 1].style['background-color'] = 'darkgoldenrod';
            if(currentBeat == 0) {
                seqColumns[seqColumns.length - 3].style['background-color'] = 'gray';
            }
        }
        curNote++;
    }, '4n'));
    Tone.start();
    Tone.Transport.start();
    playTrackButton.disabled = true;
    stopTrackButton.disabled = false;
}

// Stop track and remove note schedules
function stopTrack() {
    Tone.Transport.stop();
    scheduleIds.forEach((element) => {
        Tone.Transport.clear(element);
    });
    scheduleIds = [];
    curNote = 0;
    seqColumns.forEach((element) => {
        element.style['background-color'] = 'gray';
    })
    playTrackButton.disabled = false;
    stopTrackButton.disabled = true;
}

// Update transport BPM when value changes
function updateBPM() {
    Tone.Transport.bpm.value = trackBPM.value;
}

// Remove a sample and its row from the sequencer
function deleteSample(button) {
    const buttons = seqColumns[seqColumns.length - 1].children;
    let row;
    for(let i = 0; i < buttons.length; i++) {
        if(buttons[i] === button) {
            row = i;
        }
    };
    seqColumns.forEach((element) => {
        button = element.childNodes[row];
        if(button.getAttribute('active') != null) {
            button.click();
        }
        element.childNodes[row].remove();
    });
    samples.splice(row, 1);
    sampleBuffers.splice(row, 1);
    if(samples.length === 0) {
        stopTrack();
        playTrackButton.disabled = true;
        downloadTrackButton.disabled = true;
    }
    seqColumns = document.querySelectorAll('div.seq-column');
    seqNotes = document.querySelectorAll('.seq-note');
    numSamples = seqNotes.length / 16;
}

// Mute a sample
function muteSample(muteButton) {
    const buttons = seqColumns[seqColumns.length - 2].children;
    let row;
    let rowButton;
    for(let i = 0; i < buttons.length; i++) {
        if(buttons[i] === muteButton) {
            row = i;
        }
    };
    seqColumns.forEach((element) => {
        rowButton = element.childNodes[row];
        if(rowButton.getAttribute('muted') === null) {
            rowButton.setAttribute('muted', '');
            muteButton.style.backgroundColor = '#484848';
        }
        else {
            rowButton.removeAttribute('muted', '');
            muteButton.style.backgroundColor = '';
        };
    });
}

// Download the sequencer track
function downloadTrack() {
    // Offline audio context renderings
    Tone.Offline(({ transport }) => {

        let offlineSamples = [];
        transport.set({
            bpm: Tone.Transport.bpm.value
        });
        // Load samples into offline context
        for(let i = 0; i < sampleBuffers.length; i++) {
            offlineSamples.push(new Tone.Player(sampleBuffers[i]));
        }

        let noteIndex;
        let currentSample;
        let curNote = 0;

        // Loop through columns to schedule samples
        transport.scheduleRepeat((time) => {
            if(curNote > 15) {
                curNote = 0;
            }
    
            for(let i = 0; i < numSamples; i++) {
                noteIndex = curNote * numSamples + i;
                currentSample = noteIndex % numSamples;
                // Play sample if it is activated
                if(seqNotes[noteIndex].getAttribute('active') != null) {
                    offlineSamples[currentSample].toDestination().start(time);
                }
            }
            curNote++;
        }, '4n');
        // Start the transport
        transport.start();

    }, (1 / (Tone.Transport.bpm.value / 60)) * 16).then((buffer) => {

        // Get the wav file from the buffer for download
        let wavFile = audiobufferToWav(buffer.get());
        let blob = new window.Blob([ new DataView(wavFile) ], {
            type: 'audio/wav'
        });
        let url = window.URL.createObjectURL(blob);
        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = document.getElementById('trackTitle').value ? document.getElementById('trackTitle').value + '.wav' : 'track.wav';
        anchor.click();
        window.URL.revokeObjectURL(url);
    });
}