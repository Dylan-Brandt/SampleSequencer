import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7.0.0-beta.11/dist/wavesurfer.js';
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7.0.0-beta.11/dist/plugins/regions.js';
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
    const selectEffect = document.getElementById('selectEffect');
    const closeEffectButtons = document.getElementsByClassName('closeEffect');
    const downloadTrackButton = document.getElementById('downloadTrackButton');
    const trackBPM = document.getElementById('trackBPM');
    const sampleGain = document.getElementById('sampleGain');
    const sampleDistortion = document.getElementById('sampleDistortion');
    const delayTime = document.getElementById('delayTime');
    const delayFeedback = document.getElementById('delayFeedback');
    const delayAmount = document.getElementById('delayAmount');
    const reverbDecay = document.getElementById('reverbDecay');
    const reverbPreDelay = document.getElementById('reverbPreDelay');
    const reverbAmount = document.getElementById('reverbAmount');

    // Add event listeners
    uploadSampleButton.addEventListener('click', uploadSample);
    recordSampleButton.addEventListener('click', record);
    stopSampleButton.addEventListener('click', stopSamplePlay);
    playSampleButton.addEventListener('click', playRecording);
    downloadSampleButton.addEventListener('click', downloadRegion);
    addSampleButton.addEventListener('click', addSampleToRoll);
    playTrackButton.addEventListener('click', playTrack);
    stopTrackButton.addEventListener('click', stopTrack);
    selectEffect.addEventListener('change', openEffectControl);
    Array.from(closeEffectButtons).forEach((element) => {
        element.addEventListener('click', closeEffectControl)
    })
    trackBPM.addEventListener('change', updateBPM);
    downloadTrackButton.addEventListener('click', downloadTrack);
    sampleGain.addEventListener('change', updateEffects);
    sampleGain.addEventListener('change', setGainVal);
    sampleDistortion.addEventListener('change', updateEffects);
    sampleDistortion.addEventListener('change', setDistortionVal);
    delayTime.addEventListener('change', updateEffects);
    delayTime.addEventListener('change', setDelayTimeVal);
    delayFeedback.addEventListener('change', updateEffects);
    delayFeedback.addEventListener('change', setDelayFeedbackVal);
    delayAmount.addEventListener('change', updateEffects);
    delayAmount.addEventListener('change', setDelayAmountVal);
    reverbDecay.addEventListener('change', updateEffects);
    reverbDecay.addEventListener('change', setReverbDecayVal);
    reverbPreDelay.addEventListener('change', updateEffects);
    reverbPreDelay.addEventListener('change', setReverbPreDelayVal);
    reverbAmount.addEventListener('change', updateEffects);
    reverbAmount.addEventListener('change', setReverbAmountVal);

    configureWavesurfer();
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
audioCtx.resume();
let region;
let mediaRecorder;
let samplerBuffer = new Tone.ToneAudioBuffer();
let wavesurfer;
let wsRegions;

// Set up wavesurfer instance
function configureWavesurfer() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true,
        waveColor: 'white',
        normalize: true,
        sampleRate: audioCtx.sampleRate
    });

    wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());
    wsRegions.on('region-clicked', (region, e) => {
        e.stopPropagation();
        region.play();
        wavesurfer.on('audioprocess', autoStopRegionPlay);
    });

    wavesurfer.on('ready', () => {
        wsRegions.clearRegions();
        region = wsRegions.addRegion({
            start: 0,
            end: wavesurfer.getDuration(),
            color: "rgba(184, 134, 11, 0.25)",
            resize: true,
            drag: true
        });
    });

    wavesurfer.on('finish', () => {
        playSampleButton.style.backgroundColor = 'lightgray';
    });
}

// Reset wavesurfer and clear cache
function resetWavesurfer() {
    wavesurfer.destroy();
    wavesurfer = null;
    configureWavesurfer();
}

function uploadSample() {
    // Clear cache and reset effects
    resetWavesurfer();
    resetEffectLevels();

    // Select file
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.click();

    // Listen for file selection
    fileInput.addEventListener('change', (event) => {
        let file = event.target.files[0];
        // Check if the file is of type .wav or .mp3
        if (file.type === 'audio/wav' || file.type === 'audio/mpeg' || file.type === 'audio/webm') {
            // Use the Wavesurfer.js load method to load the file
            let url = URL.createObjectURL(file);
            samplerBuffer.load(url);
            setAllEffectValues();
            wavesurfer.load(url).then(() => {
                document.getElementById('sampleName').value = file.name.replace(/\.[^/.]+$/, "");
                stopSampleButton.disabled = false;
                playSampleButton.disabled = false;
                recordSampleButton.disabled = false;
                downloadSampleButton.disabled = false;
                addSampleButton.disabled = false;
                selectEffect.disabled = false;
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
function record() {
    if(recordSampleButton.getAttribute('recording') != null) {
        mediaRecorder.stop();

        stopSampleButton.disabled = false;
        downloadSampleButton.disabled = false;
        addSampleButton.disabled = false;
        selectEffect.disabled = false;
        recordSampleButton.removeAttribute('recording', '');
        recordSampleButton.style.backgroundColor = 'lightgray';
        return;
    }

    resetWavesurfer();
    resetEffectLevels();
    let chunks = [];
    const startTime = Date.now();
    recordSampleButton.setAttribute('recording', '');
    
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

            // Send recording to wavesurfer and buffer
            let url = URL.createObjectURL(recordedBlob);
            samplerBuffer.load(url);
            wavesurfer.load(url);
            URL.revokeObjectURL(url);

            // Enable the play button and display effect editor
            playSampleButton.disabled = false;
            document.getElementById('sampleName').value = '';
            setAllEffectValues();
        };

    // Start recording
    mediaRecorder.start();
    
    recordSampleButton.style.backgroundColor = 'gray';
    playSampleButton.disabled = true;
    stopSampleButton.disabled = true;
    downloadSampleButton.disabled = true;
    addSampleButton.disabled = true;
    selectEffect.disabled = true;
    }).catch(function(err) {
    console.error('Error accessing the microphone: ', err);
    });
}

// Function to handle stop button click
function stopSamplePlay() {
    wavesurfer.stop();
    playSampleButton.style.backgroundColor = 'lightgray';
}

// Function to handle play button click
function playRecording() {
    wavesurfer.play();
    playSampleButton.style.backgroundColor = 'gray';
}

// Stop audio when trimmed clip finishes playing
function autoStopRegionPlay() {
    if (wavesurfer.getCurrentTime() >= region.end) {
        wavesurfer.stop();
        wavesurfer.un('audioprocess', autoStopRegionPlay);
    }
}

// Create a wav encoded URL for trimmed audio clip
function getRegionURL() {
    let sourceBuffer = wavesurfer.getDecodedData();
    let destinationBuffer = audioCtx.createBuffer(1, Math.round(audioCtx.sampleRate * (region.end - region.start)), audioCtx.sampleRate);

    sourceBuffer.copyFromChannel(destinationBuffer.getChannelData(0), 0, sourceBuffer.sampleRate * region.start);
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

function openEffectControl() {
    selectEffect.disabled = true;
    let effectContainer = document.getElementById(selectEffect.value + 'Control');
    effectContainer.style.display = 'flex';
}

function closeEffectControl() {
    selectEffect.disabled = false;
    document.getElementById(selectEffect.value + 'Control').style.display = 'none';
    selectEffect.value = 'placeholder';
}

// Listener for slider change on Tone.js effects for samples
function updateEffects() {
    let regionStart = region.start;
    let regionEnd = region.end;
    resetWavesurfer(); // Clear cache

    // Render effects using offline context
    Tone.Offline((context) => {
        let player = new Tone.Player(samplerBuffer);
        player.volume.value = Number(sampleGain.value);
        let distortion = new Tone.Distortion(Number(sampleDistortion.value));
        let delay = new Tone.FeedbackDelay();
        delay.set({
            delayTime: Number(delayTime.value),
            feedback: Number(delayFeedback.value),
            wet: Number(delayAmount.value)
        });
        let reverb = new Tone.Reverb();
        reverb.set({
            decay: Number(reverbDecay.value),
            preDelay: Number(reverbPreDelay.value),
            wet: Number(reverbAmount.value)
        });
        player.chain(distortion, delay, reverb, context.destination);
        player.start().toDestination();
    }, samplerBuffer.duration).then((buffer) => {

        let wavFile = audiobufferToWav(buffer);
        let blob = new window.Blob([ new DataView(wavFile) ], {
            type: 'audio/wav'
        });
        let url = window.URL.createObjectURL(blob);

        // Load effect change into wavesurfer
        wavesurfer.load(url).then(() => {
            URL.revokeObjectURL(url);
            // Preserve audio trimming
            region.setOptions({
                start: regionStart,
                end: regionEnd,
            });
        });
    });
}

// Functions to set the labels for each effect value 
function setGainVal() {document.getElementById('sampleGainVal').innerHTML = Math.round(sampleGain.value).toString() + 'dB';}
function setDistortionVal() {document.getElementById('sampleDistortionVal').innerHTML = Math.round(sampleDistortion.value * 100).toString() + '%';}
function setReverbDecayVal() {document.getElementById('reverbDecayVal').innerHTML = Math.round(reverbDecay.value).toString() + 's';}
function setReverbPreDelayVal() {document.getElementById('reverbPreDelayVal').innerHTML = Math.round(reverbPreDelay.value * 1000).toString() + 'ms';}
function setReverbAmountVal() {document.getElementById('reverbAmountVal').innerHTML = Math.round(reverbAmount.value * 100).toString() + '%';}
function setDelayTimeVal() {document.getElementById('delayTimeVal').innerHTML = (delayTime.value).toString() + 's';}
function setDelayFeedbackVal() {document.getElementById('delayFeedbackVal').innerHTML = Math.round(delayFeedback.value * 100).toString() + '%';}
function setDelayAmountVal() {document.getElementById('delayAmountVal').innerHTML = Math.round(delayAmount.value * 100).toString() + '%';}

// Set all values
function setAllEffectValues() {
    setGainVal();
    setDistortionVal();
    setReverbDecayVal();
    setReverbPreDelayVal();
    setReverbAmountVal();
    setDelayTimeVal();
    setDelayFeedbackVal();
    setDelayAmountVal();
}

// Set default values
function resetEffectLevels() {
    sampleGain.value = 0;
    sampleDistortion.value = 0;
    reverbDecay.value = 1.5;
    reverbPreDelay.value = 0.01;
    reverbAmount.value = 0;
    delayTime.value = 0.2;
    delayFeedback.value = 0;
    delayAmount.value = 0;
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
            icon.classList.add('controlIcon');
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
            icon.classList.add('controlIcon');
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
    URL.revokeObjectURL(url);
    seqNotes = document.querySelectorAll('.seq-note');
    numSamples = seqNotes.length / 16;
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
    }, '16n'));
    Tone.start();
    Tone.Transport.start();
    playTrackButton.style.backgroundColor = 'gray';
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
    });
    playTrackButton.style.backgroundColor = 'lightgray';
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
                if(seqNotes[noteIndex].getAttribute('active') != null && seqNotes[noteIndex].getAttribute('muted') == null) {
                    offlineSamples[currentSample].toDestination().start(time);
                }
            }
            curNote++;
        }, '16n');
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