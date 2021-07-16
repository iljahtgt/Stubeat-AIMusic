/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class InputRecorder {
  constructor() {
    this.bpm = 120;
    this.player = new window.core.SoundFontPlayer(
      "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
    );
    this.viz = null;
    this.player.callbackObject = {
      run: (note) => {
        this.viz.redraw(note, true);
      },
      stop: () => {},
    };
    this.full = { notes: [], tempos: [{}] };
    this.inputOnly = { notes: [], tempos: [{}] };

    this.reset();
  }

  reset() {
    this.isPlaying = false;
    this.isRecordingInput = false;
    this.numInputBarsRecorded = 0;
    this.full.notes = [];
    this.inputOnly.notes = [];

    this.inputStartedAt = null;
    this.inputOffset = null;
  }

  setBpm(bpm) {
    this.bpm = bpm;
    this.full.tempos[0].qpm = bpm;
    this.inputOnly.tempos[0].qpm = bpm;
  }

  saveMelodyNote(note) {
    this.full.notes.push(note);
    this.full.totalTime = note.endTime;
  }

  startRecordingInput(offset) {
    console.log("starting recording input");
    this.isRecordingInput = true;
    this.inputOffset = offset;
  }

  stopRecordingInput() {
    console.log("stopping recording input");
    this.isRecordingInput = false;
    this.inputOffset = null;
  }

  saveInputNote(note) {
    note.startTime -= this.inputOffset;
    note.endTime -= this.inputOffset;
    if (note.startTime < 0) note.startTime = 0;
    this.inputOnly.notes.push(note);
    /*      console.log(this.inputOnly.notes)*/
  }

  getInput(maxLength) {
    this.inputOnly.notes.forEach(
      (n) => (n.endTime = Math.min(maxLength, n.endTime))
    );
    return this.inputOnly;
  }

  addLoops(audioLoop, recordingEndsAt) {
    audioLoop.addLoops(this.full, this.inputOffset, recordingEndsAt);
    this.player.loadSamples(this.full);
  }

  start(stopCallback) {
    if (this.full.notes.length === 0) {
      stopCallback();
      return;
    }
    this.full.totalTime = this.full.notes[this.full.notes.length - 1].endTime;

    this.isPlaying = true;

    // Clear all the existing visualizers.
    document.getElementById("svgInput").innerHTML = "";
    document.getElementById("svgMelody").innerHTML = "";
    document.getElementById("svgDrums").innerHTML = "";

    this.viz = new window.core.PianoRollSVGVisualizer(
      this.full,
      document.getElementById("svgInput"),
      {
        noteRGB: "255, 255, 255",
        activeNoteRGB: "240, 90, 99",
        minPitch: 20,
        maxPitch: 100,
        noteHeight: 1.5,
        pixelsPerTimeStep: 44,
      }
    );
    document.querySelector("#timeline").style.left = "-10px";
    document.querySelector(".visualizer").scrollLeft = 0;
    this.player.loadSamples(this.full).then(() => {
      this.player.start(this.full).then(() => stopCallback());
    });
  }

  musicRNN() {
    function makeSample(s) {
      var sets = s.notes;
      // console.log(sets.length)
      Array.prototype.forEach.call(sets, (i) => {
        transferNotes(i);
      });
      // sets.foreach(i => console.log(i));
      // console.log(trainedSet)
      trainedSet.quantizationInfo = s.quantizationInfo;
      trainedSet.tempos = s.tempos;
      trainedSet.totalQuantizedSteps = s.totalQuantizedSteps;
      rnnPlayer.start(trainedSet);
    }
    function transferNotes(x) {
      trainedSet.notes.push({
        pitch: x.pitch,
        quantizedStartStep: x.quantizedStartStep,
        quantizedEndStep: x.quantizedEndStep,
        isDrum: false,
        velocity: 80,
      });
    }
    // Initialize the model.
    let music_rnn = new mm.MusicRNN(
      "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn"
    );
    music_rnn.initialize();
    let rnn_steps = 128;
    let rnn_temperature = 1.2;
    // Create a player to play the sequence we'll get from the model.
    // let rnnPlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
    testset.notes.push(this.inputOnly.notes);

    // The model expects a quantized sequence, and ours was unquantized:
    // const qns = mm.sequences.quantizeNoteSequence(testset, 4);
    music_rnn
      .continueSequence(testset, rnn_steps, rnn_temperature)
      .then((sample) => makeSample(sample));
    document.getElementById("btnReplayRNN").disabled = false;
  }
  //downloadmusicRNN() {
  //    console.log(trainedSet)
  //}
  stop() {
    this.isPlaying = false;
    this.player.stop();
  }
  playRNN() {
    if (rnnPlayer.isPlaying()) {
      rnnPlayer.stop();

    //   document
    //     .getElementById("btnReplayRNN")
    //     .querySelector(".text").textContent = "replay";
    //   document
    //     .getElementById("btnReplayRNN")
    //     .querySelector(".play")
    //     .removeAttribute("hidden");
    //   document
    //     .getElementById("btnReplayRNN")
    //     .querySelector(".stop")
    //     .setAttribute("hidden", true);

      return;
    }

    // document.getElementById("btnReplayRNN").querySelector(".text").textContent =
    //   "stop";
    // document
    //   .getElementById("btnReplayRNN")
    //   .querySelector(".stop")
    //   .removeAttribute("hidden");
    // document
    //   .getElementById("btnReplayRNN")
    //   .querySelector(".play")
    //   .setAttribute("hidden", true);

    console.log(trainedSet);
    rnnPlayer.start(trainedSet);

    function transferNotes(x) {
      trainedSet.notes.push({
        pitch: x.pitch,
        quantizedStartStep: x.quantizedStartStep,
        quantizedEndStep: x.quantizedEndStep,
        isDrum: false,
        velocity: 80,
      });
    }
  }
}
