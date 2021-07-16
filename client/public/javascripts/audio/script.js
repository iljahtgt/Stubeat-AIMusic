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
const NOTE_LENGTH = window.Tone.Time("8n").toSeconds();
const NUM_INPUT_BARS = 4;
let TWO_BAR_LENGTH;
const VELOCITY = 80;
// 樂器音色代號
const INSTRUMENT = 26;

// Keep track of where in a 2-bar chunk we are.
let barStartedAt, twoBarCounter, loopOffset;

// Record user input melody.
let canRecordInput, numInputBarsRecorded;

// 是否生成鼓聲
let shouldRegenerateDrums = false;
let midiInDevices, midiOutDevices;
let currentOctave = 4;

const metronome = new Metronome(4);
const visualizer = new Visualizer(4);
// 記錄(音樂):recorder。InputRecorder:來自audio/input-recorder.js
const recorder = new InputRecorder();
const audioLoop = new AudioLoop(
  metronome,
  visualizer,
  VELOCITY,
  INSTRUMENT,
  () => updateUI("record-ready")
);

const piano = audioLoop.playerMelody;
testset = {
  ontrolChanges: [],
  keySignatures: [],
  notes: [],
  partInfos: [],
  pitchBends: [],
  quantizationInfo: { stepsPerQuarter: 4 },
  sectionAnnotations: [],
  sectionGroups: [],
  tempos: [{ time: 0, qpm: 90 }],
  textAnnotations: [],
  timeSignatures: [],
  totalQuantizedSteps: 128,
};
var trainedSet = {
  ontrolChanges: [],
  keySignatures: [],
  notes: [],
  partInfos: [],
  pitchBends: [],
  quantizationInfo: { stepsPerQuarter: 4 },
  sectionAnnotations: [],
  sectionGroups: [],
  tempos: [{ time: 0, qpm: 90 }],
  textAnnotations: [],
  timeSignatures: [],
  totalQuantizedSteps: 128,
};

let e;

var rnnPlayer = new mm.SoundFontPlayer(
  "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
);

initListeners();

// 網頁一開啟即準備好以下功能
function initListeners() {
  // document.getElementById('btnReady').onclick = () => {
  // const selection = document.getElementById('selectMidiOut').selectedIndex;
  // if (selection > 0) {
  //   audioLoop.switchToMidi(midiOutDevices[selection]);
  // }
  updateUI("ready");
  // }
  document.getElementById("btnRecord").onclick = startOrStop;
  // 1旋律播放鍵:btnPlay
  document.getElementById("btnPlay").onclick = playRecording;
  // 旋律儲存按鍵:btnSave
  document.getElementById("btnSave").onclick = saveRecording;
  document.getElementById("saveBtn3").onclick = downloadRecording;
  document.getElementById("btnRNN").onclick = playRNN;
  document.getElementById("btnReplayRNN").onclick = replayRNN;
  document.getElementById("btn-downloadRNN").onclick = downloadRNN;
  document.getElementById("inputMuteDrums").onchange = () => {
    audioLoop.toggleDrums(metronome.timeish());
    updateUI("toggle-drums");
  };
  document.getElementById("inputMuteInput").onchange = () => {
    audioLoop.toggleMelody(metronome.timeish());
    updateUI("toggle-melody");
  };
  document.getElementById("inputMuteClick").onchange = () => {
    metronome.muted = !metronome.muted;
    updateUI("toggle-click");
  };
  // 在首頁選擇：midi輸入來玩音樂：inputMidi(暫先關閉此選項)
  // document.getElementById('inputMidi').onchange = maybeEnableMidi;
  // 在首頁選擇：琴鍵輸入來玩音樂：inputKeyboard
  // document.getElementById('inputKeyboard').onchange = maybeEnableMidi;
  maybeEnableMidi();
  document.getElementById("btnOctaveUp").onclick = octaveUp;
  document.getElementById("btnOctaveDown").onclick = octaveDown;
  document.querySelector(".keyboard").onclick = (event) => {
    const button = event.target;
    button.classList.add("down");
    notePressed(parseInt(button.dataset.pitch) + currentOctave * 12);
    setTimeout(() => button.classList.remove("down"), 150);
  };
}

setInterval(checkPlayer, 500);

function checkPlayer() {
  if (rnnPlayer.isPlaying()) {
    document.getElementById("btnReplayRNN").querySelector(".text").textContent =
      "stop";
    document
      .getElementById("btnReplayRNN")
      .querySelector(".stop")
      .removeAttribute("hidden");
    document
      .getElementById("btnReplayRNN")
      .querySelector(".play")
      .setAttribute("hidden", true);

    return;
  }
  document.getElementById("btnReplayRNN").querySelector(".text").textContent =
    "replay";
  document
    .getElementById("btnReplayRNN")
    .querySelector(".play")
    .removeAttribute("hidden");
  document
    .getElementById("btnReplayRNN")
    .querySelector(".stop")
    .setAttribute("hidden", true);
}

// 開始紀錄或停止紀錄
function startOrStop() {
  // const selection = document.getElementById('selectMidiIn').selectedIndex;
  // 在首頁選擇：midi輸入來玩音樂：inputMidi(暫先關閉此選項)
  // const isUsingMidi = document.getElementById('inputMidi').checked && selection > 0;

  if (metronome.isTicking) {
    metronome.stop();
    window.onkeydown = null;
    updateUI("stop");
    canRecordInput = false;
    recorder.addLoops(audioLoop, metronome.timeish());
  } else {
    updateUI("ready");

    window.onkeydown = onKeydown;

    resetInputRelatedThings();

    const bpm = parseFloat(document.getElementById("inputTempo").value);
    TWO_BAR_LENGTH = (60 / bpm) * 4 * NUM_INPUT_BARS;
    visualizer.setTotalTime(TWO_BAR_LENGTH);
    recorder.setBpm(bpm);
    metronome.start(bpm, {
      clickMark: onClickMark,
      quarterMark: onQuarterMark,
      barMark: onBarMark,
    });

    updateUI("start");
    canRecordInput = true;

    // console.log('time:',canRecordInput)
  }
  // console.log('canRecordInput:',canRecordInput)
}

async function onKeydown(e) {
  if (e.repeat) return;

  switch (e.key) {
    // 琴鍵代碼
    // 白鍵(原八度)
    case "z": // All the notes we can press.
    case "x":
    case "c":
    case "v":
    case "b":
    case "n":
    case "m":
    // 白鍵高八度
    case "q":
    case "w":
    case "e":
    case "r":
    case "t":
    case "y":
    case "u":
    case "i":
    // 黑鍵(原八度)
    case "s":
    case "d":
    case "g":
    case "h":
    case "j":
    // 黑鍵高八度
    case "2":
    case "3":
    case "5":
    case "6":
    case "7":
      // button:接收來自按鈕class="note-_"訊號
      const button = document.querySelector(`.note-${e.key}`);
      // 把button訊號加入狀態：按下
      button.classList.add("down");
      // 記錄已按下的音高：notePressed
      notePressed(parseInt(button.dataset.pitch) + currentOctave * 12);
      setTimeout(() => button.classList.remove("down"), 150);
      break;
    default:
      document.body.classList.add("error");
      setTimeout(() => document.body.classList.remove("error"), 150);
      break;
  }
  // console.log('收到鍵盤訊息：',e)
}

// 記錄已按下的音高：notePressed
function notePressed(pitch) {
  const audioTime = window.Tone.immediate();
  const time = Math.max(0, audioTime - metronome.startedAt);

  const n = {
    pitch: pitch,
    velocity: VELOCITY,
    program: INSTRUMENT,
    startTime: time,
    endTime: time + NOTE_LENGTH,
  };

  piano.playNote(audioTime, n);
  recorder.saveMelodyNote(n);
  /*  console.log('n:',n)*/

  // Should we start saving?
  if (canRecordInput) {
    updateUI("save-start");
    if (!recorder.isRecordingInput) {
      recorder.startRecordingInput(barStartedAt);
      visualizer.restartBar();
      // recorder.saveInputNote(n);
      // visualizer.showInput(n, 0);
    }
    recorder.saveInputNote(n);
    visualizer.showInput(n, 0);
  } else {
    visualizer.showInput(n, loopOffset);
  }
}

function octaveUp() {
  currentOctave = Math.min(10, currentOctave + 1);
}
function octaveDown() {
  currentOctave = Math.max(2, currentOctave - 1);
}

// Display the metronome(節拍器) tick every quarter.
function onQuarterMark(time, quarter) {
  document.getElementById("tickDisplay").textContent = quarter + 1;
  if (time > 8) {
    startOrStop();
  }
  // console.log('time:',time)
}
function onClickMark(time, click) {
  visualizer.advanceBar(click);
  // console.lsog('click:',click)
}

// Every new bar, see if we're done recording input and we should drumify.
function onBarMark(time) {
  barStartedAt = time;
  twoBarCounter++;

  // Record user notes if we need to.
  if (recorder.isRecordingInput) numInputBarsRecorded++;

  // Every two bars, get new drums.
  if (!canRecordInput && twoBarCounter === 0) {
    drumifyOnServer(audioLoop.melody);
    return;
  }

  // If we've recorded at least one bar, we've spanned two bars and we should stop.
  if (numInputBarsRecorded == NUM_INPUT_BARS) {
    loopOffset = time;
    const seq = recorder.getInput(TWO_BAR_LENGTH);
  }
}

// 播放記錄的旋律:playRecording
function playRecording() {
  if (recorder.isPlaying) {
    updateUI("play-stop");
    recorder.stop();
  } else {
    updateUI("play-start");
    recorder.start(() => updateUI("play-stop"));
  }
}
function playRNN() {
  recorder.musicRNN();
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
}

function replayRNN() {
  recorder.playRNN();
  // document.getElementById('btnReplayRNN').disabled = false;
}

function downloadRNN() {
  /*    console.log(trainedSet)*/
  saveAs(
    new File(
      [mm.sequenceProtoToMidi(trainedSet)],
      "rnn_" + $("#saveNameAsPiano").val() + ".mid"
    )
  );
}
// 下載midi檔動作
function downloadRecording() {
  // console.log(recorder)
  // console.log(recorder.full)
  // saveAs(new File([window.core.sequenceProtoToMidi(recorder.full)], 'recording2.mid'));
  const quantizedSequence = mm.sequences.quantizeNoteSequence(recorder.full, 1);
  saveAs(
    new File(
      [mm.sequenceProtoToMidi(quantizedSequence)],
      $("#saveNameAsPiano").val() + ".mid"
    )
  );
  console.log("recorder:", recorder.full);
}

// 旋律儲存動作：saveRecording
function saveRecording() {
  window.saveAs(
    new File(
      [window.core.sequenceProtoToMidi(recorder.full)],
      $("#saveNameAsPiano").val() + ".mid"
    )
  );
}
async function drumifyOnServer(ns) {
  const temp = parseFloat(document.getElementById("inputTemperature").value);
  if (!shouldRegenerateDrums) {
    return;
  }
  const start = performance.now();
  ns.temperature = temp;

  fetch("/drumify", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ns),
  })
    .then((response) => response.json())
    .then((drums) => {
      updateUI(audioLoop.drums ? "has-drums-new" : "has-drums");
      //audioLoop.addDrums(drums, metronome.timeish());
      audioLoop.prepareNextDrums(drums);
      console.log("server did drums in (ms)", performance.now() - start);
    });
}

// 當按下record或stop時，重設以下功能
function resetInputRelatedThings() {
  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();
  }

  audioLoop.reset();
  recorder.reset();
  visualizer.reset();
  testset.notes = [];
  trainedSet.notes = [];
  barStartedAt = null;
  canRecordInput = true;
  numInputBarsRecorded = 0;
  twoBarCounter = 0;
  loopOffset = 0;

  document.getElementById("inputMuteDrums").value = 1;
  document.getElementById("inputMuteInput").value = 1;
}

// 首頁選完"midi或琴鍵輸入"後，執行以下功能
async function maybeEnableMidi() {
  // 在首頁選擇：midi輸入來玩音樂：inputMidi(暫先關閉此選項)

  const midiSelect = document.getElementById("midiContainer");
  const midiNotSupported = document.getElementById("textMidiNotSupported");

  if (navigator.requestMIDIAccess) {
    midiNotSupported.hidden = true;
    midiSelect.hidden = false;

    const midi = await navigator.requestMIDIAccess();
    const inputs = midi.inputs.values();
    const outputs = midi.outputs.values();
    midiInDevices = [{ name: "none (computer keyboard)" }];
    midiOutDevices = [{ name: "none (use browser audio)" }];

    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      midiInDevices.push(input.value);
    }
    for (
      let output = outputs.next();
      output && !output.done;
      output = outputs.next()
    ) {
      midiOutDevices.push(output.value);
    }
    midiIn.innerHTML = midiInDevices
      .map((device) => `<option>${device.name}</option>`)
      .join("");
    midiOut.innerHTML = midiOutDevices
      .map((device) => `<option>${device.name}</option>`)
      .join("");
  } else {
    midiNotSupported.hidden = false;
    midiSelect.hidden = true;
  }
  // }
}

// 介面更新
function updateUI(state) {
  const btnRecord = document.getElementById("btnRecord");
  const btnPlay = document.getElementById("btnPlay");
  const btnSave = document.getElementById("btnSave");
  // not renaming this, sigh.
  const btnMuteDrums = document.getElementById("inputMuteDrums");
  const btnMuteInput = document.getElementById("inputMuteInput");
  const btnMuteMetronome = document.getElementById("inputMuteClick");
  const btnOctaveUp = document.getElementById("btnOctaveUp");
  const btnOctaveDown = document.getElementById("btnOctaveDown");
  const keyboard = document.querySelector(".keyboard");
  const kbbtns = document.querySelectorAll(".kbbtn");
  const inputTempoLabel = document.getElementById("inputTempo").parentElement;
  const inputTemperatureLabel =
    document.getElementById("inputTemperature").parentElement;
  const tickDisplay = document.getElementById("tickDisplay");
  const statusUpdate = document.getElementById("statusUpdate");

  switch (state) {
    // 網頁一開啟的介面狀態:ready
    case "ready":
      // document.querySelector('.preamble').hidden = true;
      // document.querySelector('.settings').hidden = true;
      // 主要樂器控制面板區塊:main
      // document.querySelector('.main').hidden = false;
      btnPlay.disabled = true;
      btnReplayRNN.disabled = true;
      btnRNN.disabled = true;
      btnSave.disabled = true;
      btnMuteDrums.disabled = true;
      btnMuteInput.disabled = true;
      btnMuteMetronome.disabled = true;
      btnOctaveUp.disabled = true;
      btnOctaveDown.disabled = true;
      inputTempoLabel.removeAttribute("disabled");
      inputTempoLabel.hidden = false;
      inputTemperatureLabel.hidden = false;
      // tickDisplay.textContent = '☍';
      tickDisplay.textContent = "0";
      keyboard.setAttribute("disabled", true);
      break;
    case "record-ready":
      btnRecord.disabled = false;
      statusUpdate.textContent = "Press record when ready!";
      break;
    case "splash":
      document.querySelector(".splash").hidden = false;
      // 主要樂器控制面板區塊
      // document.querySelector('.main').hidden = true;
      break;
    case "start":
      document.querySelector(".volume-controls").removeAttribute("disabled");
      btnRecord.querySelector(".text").textContent = "stop";
      inputTempoLabel.setAttribute("disabled", true);
      inputTemperatureLabel.removeAttribute("disabled");
      btnMuteDrums.disabled = true;
      btnMuteInput.disabled = false;
      btnMuteMetronome.disabled = false;
      btnOctaveUp.disabled = false;
      btnOctaveDown.disabled = false;
      keyboard.removeAttribute("disabled");
      // kbbtn.removeAttribute('disabled');
      kbbtns.forEach((kbn) => kbn.removeAttribute("disabled"));
      statusUpdate.textContent =
        "Waiting for your input. Take as long as you need!";
      metronome.muted = false;
      document.getElementById("inputMuteClick").value = 1;
      // console.log('cc:',timeStamp)
      // console.log('收到鍵盤訊息：',e)
      break;
    case "stop":
      document.querySelector(".volume-controls").setAttribute("disabled", true);
      // 記錄旋律按鍵：btnRecord
      btnRecord.querySelector(".text").textContent = "record";
      btnPlay.disabled = false;
      btnRNN.disabled = false;
      btnSave.disabled = false;
      inputTempoLabel.setAttribute("disabled", true);
      inputTemperatureLabel.setAttribute("disabled", true);
      btnMuteDrums.disabled = true;
      btnMuteInput.disabled = true;
      btnMuteMetronome.disabled = true;
      btnOctaveUp.disabled = true;
      btnOctaveDown.disabled = true;
      tickDisplay.textContent = "0";
      keyboard.setAttribute("disabled", true);
      // kbbtn.setAttribute('disabled', true);
      kbbtns.forEach((kbn) => kbn.setAttribute("disabled", true));
      statusUpdate.textContent = "Listen to your melody, or start again!";
      tickDisplay.classList.remove("saving");
      document.querySelector(".keyboard-box").classList.remove("saving");
      break;
    case "has-drums":
      btnMuteDrums.disabled = false;
      statusUpdate.textContent = "Drums ready; waiting for the next loop...";
      break;
    case "has-drums-new":
      statusUpdate.textContent =
        "New drums ready; waiting for the next loop...";
      break;
    case "get-drums-new":
      statusUpdate.textContent = "Getting new drums";
      break;
    case "no-drums-new":
      statusUpdate.textContent = "Drums regeneration paused";
      break;
    case "yes-drums-new":
      statusUpdate.textContent = "Drums regeneration resumed";
      break;
    case "drums-start":
      statusUpdate.textContent = "Starting drums!";
      break;
    case "play-start":
      keyboard.setAttribute("disabled", true);
      kbbtns.forEach((kbn) => kbn.setAttribute("disabled", true));
      btnPlay.querySelector(".text").textContent = "stop";
      btnPlay.querySelector(".stop").removeAttribute("hidden");
      btnPlay.querySelector(".play").setAttribute("hidden", true);
      btnRecord.disabled = true;
      btnSave.disabled = true;
      btnMuteDrums.disabled = true;
      btnMuteInput.disabled = true;
      btnMuteMetronome.disabled = true;
      btnOctaveUp.disabled = true;
      btnOctaveDown.disabled = true;
      statusUpdate.textContent = "How does this sound?";
      break;
    case "play-stop":
      keyboard.setAttribute("disabled", true);
      kbbtns.forEach((kbn) => kbn.setAttribute("disabled", true));
      btnRecord.disabled = false;
      btnSave.disabled = false;
      btnPlay.querySelector(".text").textContent = "play";
      btnPlay.querySelector(".play").removeAttribute("hidden");
      btnPlay.querySelector(".stop").setAttribute("hidden", true);
      btnMuteDrums.disabled = true;
      btnMuteInput.disabled = true;
      btnMuteMetronome.disabled = true;
      btnOctaveUp.disabled = true;
      btnOctaveDown.disabled = true;
      statusUpdate.textContent = "Listen to your melody, or start again!";
      break;
    case "save-start":
      tickDisplay.classList.add("saving");
      document.querySelector(".keyboard-box").classList.add("saving");
      statusUpdate.textContent = "Recording your input...";
      break;
    case "save-stop":
      tickDisplay.classList.remove("saving");
      document.querySelector(".keyboard-box").classList.remove("saving");
      statusUpdate.textContent = "Generating drums";
      break;
    case "loading-samples":
      btnRecord.disabled = true;
      btnPlay.disabled = true;
      statusUpdate.textContent = "Loading soundfont files...";
      break;
    case "loading-samples-done":
      btnRecord.disabled = false;
      btnPlay.disabled = false;
      statusUpdate.textContent = `Done! ${
        document.getElementById("dropInstruments").value
      } ready.`;
      break;
    case "toggle-drums":
      btnMuteDrums.textContent = audioLoop.drumsMuted
        ? "unmute drums"
        : "mute drums";
      break;
    case "toggle-melody":
      btnMuteInput.textContent = audioLoop.melodyMuted
        ? "unmute input"
        : "mute input";
      break;
    case "toggle-click":
      btnMuteMetronome.textContent = metronome.muted
        ? "unmute click"
        : "mute click";
      break;
  }
}
