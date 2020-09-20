let metronome = { };

(function () {
  'use strict';
  
  let index = -1;
  let lengths = [];
  let measures = [];
  
  let counts = 4;
  
  let audioContext = null;
  let nextNoteTime = 0.0; // When the next note is due.
  let noteLength = 0.05; // Length of a beep (in seconds).

  let timerWorker = null;

  metronome.isPlaying = false;
  
  metronome.init = function () {
    audioContext = new AudioContext();

    timerWorker = new Worker("res/metronomeworker.js");
    timerWorker.onmessage = function(e) {
      if (e.data == "tick")
        scheduler();
      else
        console.error("Unexpected message: " + e.data);
    };
  }

  function scheduler() {
    while (nextNoteTime < audioContext.currentTime + noteLength) {
      if (index < lengths.length) {
        scheduleNote(nextNoteTime);
        nextNote();
      }
      else {
        stop();
        break;
      }
    }
  }

  function scheduleNote(time) {
    let osc = audioContext.createOscillator();
    osc.connect(audioContext.destination);
    osc.frequency.value = index < counts ? 220.0 : measures.includes(index) ? 880.0 : 440.0;
    osc.start(time);
    osc.stop(time + noteLength);
  }

  function nextNote() {
    nextNoteTime += lengths[index];
    index++;
  }

  metronome.start = function (data) {
    if (metronome.isPlaying) return;
    
    lengths = data.lengths;
    measures = data.measures;
    
    for (let i = 0; i < counts; i++) {
      lengths.unshift(lengths[0]);
    }
    for (let i = 0; i < measures.length; i++) {
      measures[i] += counts;
    }
    
    metronome.isPlaying = true;
    nextNoteTime = audioContext.currentTime;
    index = 0;
    timerWorker.postMessage("start");
  }
  
  metronome.stop = function () {
    if (!metronome.isPlaying) return;
    
    metronome.isPlaying = false;
    timerWorker.postMessage("stop");
  }
})();