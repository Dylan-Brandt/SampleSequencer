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

    const selectSampleEffect = document.getElementById('selectSampleEffect');
    const closeSampleEffectButtons = document.getElementsByClassName('closeSampleEffect');
    const downloadTrackButton = document.getElementById('downloadTrackButton');
    const trackBPM = document.getElementById('trackBPM');
    const sampleGain = document.getElementById('sampleGain');
    const sampleThreshold = document.getElementById('sampleThreshold');
    const sampleRatio = document.getElementById('sampleRatio');
    const sampleDistortion = document.getElementById('sampleDistortion');
    const delayTime = document.getElementById('delayTime');
    const delayFeedback = document.getElementById('delayFeedback');
    const delayAmount = document.getElementById('delayAmount');
    const reverbDecay = document.getElementById('reverbDecay');
    const reverbPreDelay = document.getElementById('reverbPreDelay');
    const reverbAmount = document.getElementById('reverbAmount');

    const selectTrackEffect = document.getElementById('selectTrackEffect');
    const closeTrackEffectButtons = document.getElementsByClassName('closeTrackEffect');
    const trackThreshold = document.getElementById('trackThreshold');
    const trackRatio = document.getElementById('trackRatio');
    const trackGain = document.getElementById('trackGain');
    const trackChorusFrequency = document.getElementById('trackChorusFrequency');
    const trackChorusDelayTime = document.getElementById('trackChorusDelayTime');
    const trackChorusDepth = document.getElementById('trackChorusDepth');
    const trackChorusAmount = document.getElementById('trackChorusAmount');
    const trackPhaserFrequency = document.getElementById('trackPhaserFrequency');
    const trackPhaserAmount = document.getElementById('trackPhaserAmount');
    const trackVibratoFrequency = document.getElementById('trackVibratoFrequency');
    const trackVibratoDepth = document.getElementById('trackVibratoDepth');
    const trackVibratoAmount = document.getElementById('trackVibratoAmount');
    const trackReverbDecay = document.getElementById('trackReverbDecay');
    const trackReverbPreDelay = document.getElementById('trackReverbPreDelay');
    const trackReverbAmount = document.getElementById('trackReverbAmount');

    const patternButtons = document.getElementsByClassName('patternButton');


    // Add event listeners
    uploadSampleButton.addEventListener('click', uploadSample);
    recordSampleButton.addEventListener('click', recordSample);
    stopSampleButton.addEventListener('click', stopSamplePlay);
    playSampleButton.addEventListener('click', playSample);
    downloadSampleButton.addEventListener('click', downloadRegion);
    addSampleButton.addEventListener('click', addSampleToRoll);

    playTrackButton.addEventListener('click', playTrack);
    stopTrackButton.addEventListener('click', stopTrack);

    selectSampleEffect.addEventListener('change', openSampleEffectControl);
    Array.from(closeSampleEffectButtons).forEach((element) => {
        element.addEventListener('click', closeSampleEffectControl)
    })
    trackBPM.addEventListener('change', updateBPM);
    downloadTrackButton.addEventListener('click', downloadTrack);
    sampleGain.addEventListener('change', updateEffects);
    sampleGain.addEventListener('change', setGainVal);
    sampleThreshold.addEventListener('change', updateEffects);
    sampleThreshold.addEventListener('change', setSampleThresholdVal);
    sampleRatio.addEventListener('change', updateEffects);
    sampleRatio.addEventListener('change', setSampleRatioVal);
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

    selectTrackEffect.addEventListener('change', openTrackEffectControl);
    Array.from(closeTrackEffectButtons).forEach((element) => {
        element.addEventListener('click', closeTrackEffectControl)
    })
    trackThreshold.addEventListener('change', setTrackThresholdVal);
    trackRatio.addEventListener('change', setTrackRatioVal);
    trackGain.addEventListener('change', setTrackEffectLevels);
    trackGain.addEventListener('change', setTrackGainVal);
    trackChorusFrequency.addEventListener('change', setTrackEffectLevels);
    trackChorusFrequency.addEventListener('change', setTrackChorusFrequencyVal);
    trackChorusDelayTime.addEventListener('change', setTrackEffectLevels);
    trackChorusDelayTime.addEventListener('change', setTrackChorusDelayTimeVal);
    trackChorusDepth.addEventListener('change', setTrackEffectLevels);
    trackChorusDepth.addEventListener('change', setTrackChorusDepthVal);
    trackChorusAmount.addEventListener('change', setTrackEffectLevels);
    trackChorusAmount.addEventListener('change', setTrackChorusAmountVal);
    trackPhaserFrequency.addEventListener('change', setTrackEffectLevels);
    trackPhaserFrequency.addEventListener('change', setTrackPhaserFrequencyVal);
    trackPhaserAmount.addEventListener('change', setTrackEffectLevels);
    trackPhaserAmount.addEventListener('change', setTrackPhaserAmountVal);
    trackVibratoFrequency.addEventListener('change', setTrackEffectLevels);
    trackVibratoFrequency.addEventListener('change', setTrackVibratoFrequencyVal);
    trackVibratoDepth.addEventListener('change', setTrackEffectLevels);
    trackVibratoDepth.addEventListener('change', setTrackVibratoDepthVal);
    trackVibratoAmount.addEventListener('change', setTrackEffectLevels);
    trackVibratoAmount.addEventListener('change', setTrackVibratoAmountVal);
    trackReverbDecay.addEventListener('change', setTrackEffectLevels);
    trackReverbDecay.addEventListener('change', setTrackReverbDecayVal);
    trackReverbPreDelay.addEventListener('change', setTrackEffectLevels);
    trackReverbPreDelay.addEventListener('change', setTrackReverbPreDelayVal);
    trackReverbAmount.addEventListener('change', setTrackEffectLevels);
    trackReverbAmount.addEventListener('change', setTrackReverbAmountVal);

    Array.from(patternButtons).forEach((element) => {
        element.addEventListener('click', () => {
            sendPatternToRoll(element);
        })
    })

    configureWavesurfer();
}

window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
audioCtx.resume();
let sampleRegion;
let mediaRecorder;
let samplerBuffer = new Tone.ToneAudioBuffer();
let wavesurfer;
let wsRegions;


// Set up wavesurfer instance
function configureWavesurfer() {
    let disableDragSelection;

    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true,
        waveColor: 'white',
        normalize: true,
        sampleRate: audioCtx.sampleRate
    });

    wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());
    
    wsRegions.on('region-created', (region) => {
        sampleRegion = region;
        disableDragSelection();
    });
    wsRegions.on('region-clicked', (region, e) => {
        e.stopPropagation();
        region.play();
        wavesurfer.on('audioprocess', autoStopRegionPlay);
    });

    wavesurfer.on('ready', () => {
        wsRegions.clearRegions();
        disableDragSelection = wsRegions.enableDragSelection({
            color: 'rgba(184, 134, 11, 0.25)',
            resize: true,
            drag: true
        });
        if(sampleRegion) {
            sampleRegion = wsRegions.addRegion({
                start: sampleRegion.start,
                end: sampleRegion.end,
                color: "rgba(184, 134, 11, 0.25)",
                resize: true,
                drag: true
            });
        }
    });

    wavesurfer.on('finish', () => {
        playSampleButton.style.backgroundColor = '';
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
                selectSampleEffect.disabled = false;
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
function recordSample() {
    if(recordSampleButton.getAttribute('recording') != null) {
        mediaRecorder.stop();

        stopSampleButton.disabled = false;
        downloadSampleButton.disabled = false;
        addSampleButton.disabled = false;
        selectSampleEffect.disabled = false;
        recordSampleButton.removeAttribute('recording', '');
        recordSampleButton.style.backgroundColor = null;
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
    selectSampleEffect.disabled = true;
    }).catch(function(err) {
    console.error('Error accessing the microphone: ', err);
    });
}

// Function to handle stop button click
function stopSamplePlay() {
    wavesurfer.stop();
    playSampleButton.style.backgroundColor = '';
}

// Function to handle play button click
function playSample() {
    wavesurfer.play();
    playSampleButton.style.backgroundColor = 'gray';
}

// Stop audio when trimmed clip finishes playing
function autoStopRegionPlay() {
    if (wavesurfer.getCurrentTime() >= sampleRegion.end) {
        wavesurfer.stop();
        wavesurfer.un('audioprocess', autoStopRegionPlay);
    }
}

// Create a wav encoded URL for trimmed audio clip
function getRegionURL() {
    let sourceBuffer = wavesurfer.getDecodedData();
    let destinationBuffer;
    if(sampleRegion) {
        destinationBuffer = audioCtx.createBuffer(1, Math.round(audioCtx.sampleRate * (sampleRegion.end - sampleRegion.start)), audioCtx.sampleRate);
        sourceBuffer.copyFromChannel(destinationBuffer.getChannelData(0), 0, sourceBuffer.sampleRate * sampleRegion.start);
    }
    else {
        destinationBuffer = audioCtx.createBuffer(1, Math.round(audioCtx.sampleRate * (wavesurfer.getDuration())), audioCtx.sampleRate);
        sourceBuffer.copyFromChannel(destinationBuffer.getChannelData(0), 0);
    } 

    
    let wavFile = audiobufferToWav(destinationBuffer);
    let blob = new window.Blob([ new DataView(wavFile) ], {
        type: 'audio/wav'
    });
    return window.URL.createObjectURL(blob);
}

function getBufferURL(buffer) {
    let wavFile = audiobufferToWav(buffer);
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

function openSampleEffectControl() {
    selectSampleEffect.disabled = true;
    let effectContainer = document.getElementById(selectSampleEffect.value + 'Control');
    effectContainer.style.display = 'flex';
}

function closeSampleEffectControl() {
    selectSampleEffect.disabled = false;
    document.getElementById(selectSampleEffect.value + 'Control').style.display = 'none';
    selectSampleEffect.value = 'placeholder';
}

// Listener for slider change on Tone.js effects for samples
function updateEffects() {
    resetWavesurfer(); // Clear cache

    // Render effects using offline context
    Tone.Offline((context) => {
        let player = new Tone.Player(samplerBuffer);
        player.volume.value = Number(sampleGain.value);
        let compression = new Tone.Compressor(Number(sampleThreshold.value), Number(sampleRatio.value));
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
        player.chain(compression, distortion, delay, reverb, context.destination);
        player.start().toDestination();
    }, samplerBuffer.duration).then((buffer) => {

        let url = getBufferURL(buffer);
        // Load effect change into wavesurfer
        wavesurfer.load(url).then(() => {
            URL.revokeObjectURL(url);
        });
    });
}

// Functions to set the labels for each effect value 
function setGainVal() {document.getElementById('sampleGainVal').innerHTML = Math.round(sampleGain.value).toString() + 'dB';}
function setSampleThresholdVal() {document.getElementById('sampleThresholdVal').innerHTML = Math.round(sampleThreshold.value).toString() + 'dB';}
function setSampleRatioVal() {document.getElementById('sampleRatioVal').innerHTML = Math.round(sampleRatio.value).toString() + ':1';}
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
    setSampleThresholdVal();
    setSampleRatioVal();
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
    sampleThreshold.value = 0;
    sampleRatio.value = 1;
    reverbDecay.value = 1.5;
    reverbPreDelay.value = 0.01;
    reverbAmount.value = 0;
    delayTime.value = 0.2;
    delayFeedback.value = 0;
    delayAmount.value = 0;

    sampleRegion = null;
}

let samples = []; // Array of samples as Tone.js Players
let sampleBuffers = []; // Array of samples as ToneAudioBuffers
let scheduleIds = []; // IDs for sequencer events
let seqColumns; // Columns of the sequencer
let seqNotes; // Sequencer notes
let numSamples; // Number of samples
let curNote = 0; // Current note when sequencer is playing
let patterns = new Array(4);
for(let i = 0; i < 4; i++) {
    patterns[i] = new Array();
}
let activePattern = 0;
let patternNoteCounts = [0, 0, 0, 0];

// Setup the transport
Tone.Transport.set({
    bpm: 120,
    loop: true,
    loopStart: 0,
    loopEnd: "4m",
    timeSignature: 4
});

let trackCompression = new Tone.Compressor();
let trackReverb = new Tone.Reverb();
let trackChorus = new Tone.Chorus();
let trackPhaser = new Tone.Phaser();
let trackVibrato = new Tone.Vibrato();
Tone.Destination.chain(trackCompression, trackChorus, trackVibrato, trackPhaser, trackReverb);
setTrackEffectLevels();

function getEmptyPattern() {
    let button = document.createElement('button');
    button.className = 'seq-note';
    let pattern = [];
    for(let i = 0; i < 16; i++) {
        button.noteindex = i.toString();
        button.style.backgroundColor = 'whitesmoke';
        pattern[i] = button.cloneNode();
    }
    button.remove();
    return pattern;
}

// Add trimmed audio clip to sequencer roll
function addSampleToRoll() {
    seqColumns = document.querySelectorAll('div.seq-column');
    playTrackButton.disabled = false;
    downloadTrackButton.disabled = false;
    selectTrackEffect.disabled = false;
    setAllTrackEffectValues();

    seqColumns.forEach((currentValue, index) => {
        if(index == 0) {
            // Sample title
            let label = document.createElement('span');
            label.className = 'sampleLabel';
            label.addEventListener('click', () => {
                playSampleInRoll(label);
            })
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
            button.setAttribute('noteindex', (index - 1).toString());
            button.style.backgroundColor = 'whitesmoke';
            button.addEventListener('click', () => {
                toggleNote(button);
            });
            currentValue.appendChild(button);
            scheduleIds.push(null);
        }
    });

    let url = getRegionURL();
    let player = new Tone.Player(url).toDestination();
    samples.push(player);
    sampleBuffers.push(new Tone.ToneAudioBuffer(url));
    URL.revokeObjectURL(url);
    seqNotes = document.querySelectorAll('.seq-note');
    numSamples = seqNotes.length / 16;

    for(let i = 0; i < 4; i++) {
        patterns[i].push([]);
        patterns[i][patterns[i].length - 1].push(getEmptyPattern());
    }
}

function playSampleInRoll(label) {
    const labels = document.querySelectorAll('.sampleLabel');
    let row;
    for(let i = 0; i < labels.length; i++) {
        if(labels[i] === label) {
            row = i;
        }
    };
    samples[row].start();
}

// Toggle a note in the sequencer
function toggleNote(button) {
    const buttons = document.querySelectorAll('[noteindex="' + button.getAttribute('noteindex') + '"]');
    let row;
    for(let i = 0; i < buttons.length; i++) {
        if(buttons[i] === button) {
            row = i;
        }
    };
    if(button.getAttribute('active') === null) {
        button.setAttribute('active', '');
        patterns[activePattern][row][0][Number(button.getAttribute('noteindex'))].setAttribute('active', '');
        button.style.backgroundColor = '#303030';
        patternNoteCounts[activePattern]++;
    }
    else {
        button.removeAttribute('active', '');
        patterns[activePattern][row][0][Number(button.getAttribute('noteindex'))].removeAttribute('active', '');
        button.style.backgroundColor = 'whitesmoke';
        patternNoteCounts[activePattern]--;
    };
    patterns[activePattern];
    patterns[activePattern][row][0][Number(button.getAttribute('noteindex'))].style.backgroundColor = button.style.backgroundColor;
}

// Function to schedule and play active notes
function playTrack() {
    let noteIndex;
    let currentSample;
    let currentBeat;
    sendPatternToRoll(document.getElementById('pattern0Button'));
    disablePatternButtons();

    scheduleIds.push(Tone.Transport.scheduleRepeat((time) => {
        if(curNote > 15) {
            if(patternNoteCounts[(activePattern + 1) % 4] > 0) {
                sendPatternToRoll(document.getElementById('pattern' + ((activePattern + 1) % 4).toString() + 'Button'));
            }
            else {
                sendPatternToRoll(document.getElementById('pattern0Button'));
            }
            curNote = 0;
        }
        for(let i = 0; i < numSamples; i++) {
            noteIndex = curNote * numSamples + i;
            currentBeat = Math.floor(noteIndex/numSamples);
            // // Play sample if it is activated
            if(seqNotes[noteIndex].getAttribute('active') != null && seqNotes[noteIndex].getAttribute('muted') == null) {
                samples[i].start(time);
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
    enablePatternButtons();
    Tone.Transport.stop();
    scheduleIds.forEach((element) => {
        Tone.Transport.clear(element);
    });
    scheduleIds = [];
    curNote = 0;
    seqColumns.forEach((element) => {
        element.style['background-color'] = 'gray';
    });
    playTrackButton.style.backgroundColor = '';
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
    for(let i = 0; i < 4; i++) {
        patterns[i].splice(row, 1);
    }
    if(samples.length === 0) {
        stopTrack();
        playTrackButton.disabled = true;
        downloadTrackButton.disabled = true;
        selectTrackEffect.disabled = true;
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
    let numActiveBeats = 0;
    for(let i = 0; i < 4; i++) {
        if(patternNoteCounts > 0) {
            numActiveBeats += 16;
        }
        else {
            break;
        }
    }
    // Offline audio context renderings
    Tone.Offline(({ transport }) => {

        let offlineSamples = [];
        transport.set({
            bpm: Tone.Transport.bpm.value
        });
        // Load samples into offline context
        for(let i = 0; i < sampleBuffers.length; i++) {
            offlineSamples.push(new Tone.Player(sampleBuffers[i]).toDestination());
        }
        let trackDist = new Tone.Distortion();
        let trackCompression = new Tone.Compressor();
        let trackReverb = new Tone.Reverb();
        let trackChorus = new Tone.Chorus();
        let trackPhaser = new Tone.Phaser();
        let trackVibrato = new Tone.Vibrato();
        trackCompression.set({
            threshold: Number(trackThreshold.value),
            ratio: Number(trackRatio.value)
        });
        trackChorus.set({
            frequency: Number(trackChorusFrequency.value),
            delayTime: Number(trackChorusDelayTime.value),
            depth: Number(trackChorusDepth.value),
            wet: Number(trackChorusAmount.value),
            feedback: 0.5
        });
        trackPhaser.set({
            frequency: Number(trackPhaserFrequency.value),
            wet: Number(trackPhaserAmount.value),
            baseFrequency: 1000,
            octaves: 5
        });
        trackVibrato.set({
            frequency: Number(trackVibratoFrequency.value),
            depth: Number(trackVibratoDepth.value),
            wet: Number(trackVibratoAmount.value)
        })
        trackReverb.set({
            decay: Number(trackReverbDecay.value),
            preDelay: Number(trackReverbPreDelay.value),
            wet: Number(trackReverbAmount.value)
        });
        Tone.getContext().destination.chain(trackCompression, trackDist, trackChorus, trackPhaser, trackVibrato, trackReverb);

        let curNote = 0;

        // Loop through columns to schedule samples
        transport.scheduleRepeat((time) => {
            for(let i = 0; i < numSamples; i++) {
                if(patterns[Math.floor(curNote / 16)][i][0][curNote % 16].getAttribute('active') != null && patterns[Math.floor(curNote / 16)][i][0][curNote % 16].getAttribute('muted') == null) {
                    offlineSamples[i].start(time);
                }
            }
            curNote++;
        }, '16n');
        // Start the transport
        transport.start();

    }, (1 / (Tone.Transport.bpm.value / 60)) * 8).then((buffer) => {
        let url = getBufferURL(buffer);
        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = document.getElementById('trackTitle').value ? document.getElementById('trackTitle').value + '.wav' : 'track.wav';
        anchor.click();
        window.URL.revokeObjectURL(url);
    });
}

function openTrackEffectControl() {
    selectTrackEffect.disabled = true;
    let effectContainer = document.getElementById(selectTrackEffect.value + 'Control');
    effectContainer.style.display = 'flex';
}

function closeTrackEffectControl() {
    selectTrackEffect.disabled = false;
    document.getElementById(selectTrackEffect.value + 'Control').style.display = 'none';
    selectTrackEffect.value = 'placeholder';
}

// Set levels for track effects
function setTrackEffectLevels() {
    trackCompression.set({
        threshold: Number(trackThreshold.value),
        ratio: Number(trackRatio.value)
    });
    Tone.Destination.volume.value = trackGain.value;
    trackChorus.set({
        frequency: Number(trackChorusFrequency.value),
        delayTime: Number(trackChorusDelayTime.value),
        depth: Number(trackChorusDepth.value),
        wet: Number(trackChorusAmount.value),
        feedback: 0.5
    });
    trackPhaser.set({
        frequency: Number(trackPhaserFrequency.value),
        wet: Number(trackPhaserAmount.value),
        baseFrequency: 1000,
        octaves: 5
    });
    trackVibrato.set({
        frequency: Number(trackVibratoFrequency.value),
        depth: Number(trackVibratoDepth.value),
        wet: Number(trackVibratoAmount.value)
    })
    trackReverb.set({
        decay: Number(trackReverbDecay.value),
        preDelay: Number(trackReverbPreDelay.value),
        wet: Number(trackReverbAmount.value)
    });
}

function setTrackThresholdVal() {document.getElementById('trackThresholdVal').innerHTML = Math.round(trackThreshold.value).toString() + 'dB';}
function setTrackRatioVal() {document.getElementById('trackRatioVal').innerHTML = Math.round(trackRatio.value).toString() + ':1';}
function setTrackGainVal() {document.getElementById('trackGainVal').innerHTML = Math.round(trackGain.value).toString() + 'dB';}
function setTrackChorusFrequencyVal() {document.getElementById('trackChorusFrequencyVal').innerHTML = (trackChorusFrequency.value).toString() + 'Hz';}
function setTrackChorusDelayTimeVal() {document.getElementById('trackChorusDelayTimeVal').innerHTML = Math.round(trackChorusDelayTime.value * 100).toString() + 'ms';}
function setTrackChorusDepthVal() {document.getElementById('trackChorusDepthVal').innerHTML = Math.round(trackChorusDepth.value * 100).toString() + '%';}
function setTrackChorusAmountVal() {document.getElementById('trackChorusAmountVal').innerHTML = Math.round(trackChorusAmount.value * 100).toString() + '%';}
function setTrackPhaserFrequencyVal() {document.getElementById('trackPhaserFrequencyVal').innerHTML = (trackPhaserFrequency.value).toString() + 'Hz';}
function setTrackPhaserAmountVal() {document.getElementById('trackPhaserAmountVal').innerHTML = Math.round(trackPhaserAmount.value * 100).toString() + '%';}
function setTrackVibratoFrequencyVal() {document.getElementById('trackVibratoFrequencyVal').innerHTML = (trackVibratoFrequency.value).toString() + 'Hz';}
function setTrackVibratoDepthVal() {document.getElementById('trackVibratoDepthVal').innerHTML = Math.round(trackVibratoDepth.value * 100).toString() + '%';}
function setTrackVibratoAmountVal() {document.getElementById('trackVibratoAmountVal').innerHTML = Math.round(trackVibratoAmount.value * 100).toString() + '%';}
function setTrackReverbDecayVal() {document.getElementById('trackReverbDecayVal').innerHTML = Math.round(trackReverbDecay.value).toString() + 's';}
function setTrackReverbPreDelayVal() {document.getElementById('trackReverbPreDelayVal').innerHTML = Math.round(trackReverbPreDelay.value * 1000).toString() + 'ms';}
function setTrackReverbAmountVal() {document.getElementById('trackReverbAmountVal').innerHTML = Math.round(trackReverbAmount.value * 100).toString() + '%';}

// Set all values
function setAllTrackEffectValues() {
    setTrackThresholdVal();
    setTrackRatioVal();
    setTrackGainVal();
    setTrackChorusFrequencyVal();
    setTrackChorusDelayTimeVal();
    setTrackChorusDepthVal();
    setTrackChorusAmountVal();
    setTrackPhaserFrequencyVal();
    setTrackPhaserAmountVal();
    setTrackVibratoFrequencyVal();
    setTrackVibratoDepthVal();
    setTrackVibratoAmountVal();
    setTrackReverbDecayVal();
    setTrackReverbPreDelayVal();
    setTrackReverbAmountVal();
}

// Set default values
function resetTrackEffectLevels() {
    trackThreshold.value = 0;
    trackRatio.value = 1;
    trackGain.value = 0;
    trackChorusFrequency.value = 1.5;
    trackChorusDelayTime.value = 0.03;
    trackChorusDepth.value = 0.5;
    trackChorusAmount.value = 0;
    trackPhaserFrequency.value = 0.5;
    trackPhaserAmount.value = 0;
    trackVibratoFrequency.value = 0.5;
    trackVibratoDepth.value = 0.5;
    trackVibratoAmount.value = 0;
    trackReverbDecay.value = 1.5;
    trackReverbPreDelay.value = 0.01;
    trackReverbAmount.value = 0;
}

// Send one of four stored patterns to the sequencer roll
function sendPatternToRoll(button) {
    document.getElementById('pattern' + activePattern.toString() + 'Button').style.backgroundColor = '';
    activePattern = Number(button.id.replace('pattern', '').replace('Button', ''));
    document.getElementById('pattern' + activePattern.toString() + 'Button').style.backgroundColor = 'gray';
    let colNotes;
    for(let col = 0; col < 16; col++) {
        colNotes = document.querySelectorAll('[noteindex="' + col.toString() + '"]');
        for(let row = 0; row < colNotes.length; row++) {
            patterns[activePattern][row][0][col].setAttribute('noteindex', col.toString());
            colNotes[row].style.backgroundColor = patterns[activePattern][row][0][col].style.backgroundColor;
            if(patterns[activePattern][row][0][col].getAttribute('active') != null) {
                colNotes[row].setAttribute('active', '');
            }
            else {
                colNotes[row].removeAttribute('active', '');
            }
        }
    }
}

function disablePatternButtons() {
    document.getElementById('pattern0Button').disabled = 'true';
    document.getElementById('pattern1Button').disabled = 'true';
    document.getElementById('pattern2Button').disabled = 'true';
    document.getElementById('pattern3Button').disabled = 'true';
}

function enablePatternButtons() {
    document.getElementById('pattern0Button').removeAttribute('disabled', '');
    document.getElementById('pattern1Button').removeAttribute('disabled', '');
    document.getElementById('pattern2Button').removeAttribute('disabled', '');
    document.getElementById('pattern3Button').removeAttribute('disabled', '');
}
