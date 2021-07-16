// Datacontent={
// ontrolChanges: [],
// keySignatures: [],
//     notes: [],
// partInfos: [],
// pitchBends: [],
// quantizationInfo: { stepsPerQuarter: 4 },
// sectionAnnotations: [],
// sectionGroups: [],
// tempos: [{ qpm: 120 }],
// textAnnotations: [],
// timeSignatures: [],
// totalQuantizedSteps: 32
// }

var drumSet = [36, 38, 42, 46, 50, 45, 48];

// let setQpm
var unquantizedSeq = {
  notes: [],
  totalTime: 8,
};

var testset = {
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
  totalQuantizedSteps: 32,
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
  totalQuantizedSteps: 32,
};

var player = new mm.SoundFontPlayer(
  "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
);
var fileName = "";
init();
function init() {
  $(".soundBtn").on("click", noteOn);
  $("#play").on("click", getPlay);
  $("#sectionNum").on("change", changeSection);
  $("#qpmVal").on("change", qpmChange);
  $("#fileBtn").on("change", uploadFile);
  $("#savebtn").on("click", () =>
    saveAs(
      new File(
        [mm.sequenceProtoToMidi(testset)],
        $("#saveNameAs").val() + ".mid"
      )
    )
  );
  $("#saveTrainedbtn").on("click", () =>
    saveAs(
      new File(
        [mm.sequenceProtoToMidi(trainedSet)],
        "rnn_" + $("#saveNameAs").val() + ".mid"
      )
    )
  );
  $("#generate").on("click", musicRnn);
  $("#clearBtn").on("click", clear);

  // save json file
  $("#savetoJson").on("click", () =>
    saveAs(new File([JSON.stringify(testset)], "sample.json"))
  );
  $("#savetoJson_rnn").on("click", () =>
    saveAs(new File([JSON.stringify(trainedSet)], "sample.json"))
  );

  // playing the samples
  $("#sampleBefore1").on("click", () =>
    samplePlayer("/samples/sample1_before.json")
  );
  $("#sampleAfter1").on("click", () =>
    samplePlayer("/samples/sample1_after.json")
  );
  $("#sampleBefore2").on("click", () =>
    samplePlayer("/samples/sample2_before.json")
  );
  $("#sampleAfter2").on("click", () =>
    samplePlayer("/samples/sample2_after.json")
  );
}

var sPlayer = new mm.SoundFontPlayer(
  "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
);
function samplePlayer(filePath) {
  if (sPlayer.isPlaying()) {
    sPlayer.stop();
    return;
  }

  $.ajax({
    type: "get",
    url: filePath,
    dataType: "json",
  }).done((result) => {
    sPlayer.start(result);
  });
}

function clear() {
  location.reload();
}

function qpmChange() {
  var n = parseInt($("#qpmVal").val());
  testset.tempos[0].qpm = n;
  trainedSet.tempos[0].qpm = n;
}

function changeSection() {
  var noteNum = parseInt($("#sectionNum").val()) * 8;
  var timeSeriNum = $("#btnGroup div:last-child").index();
  console.log(timeSeriNum);
  testset.totalQuantizedSteps = noteNum;
  trainedSet.totalQuantizedSteps = noteNum;
  if (noteNum > timeSeriNum) {
    for (i = 0; i < noteNum - timeSeriNum; i++) {
      $("#btnGroup").append(
        '<div class="timeSeri"><button class="soundBtn"></button><button class="soundBtn"></button><button class="soundBtn"></button><button class="soundBtn"></button><button class="soundBtn"></button><button class="soundBtn"></button><button class="soundBtn"></button></div>'
      );
    }
  } else if (noteNum < timeSeriNum) {
    for (i = 0; i < timeSeriNum - noteNum; i++) {
      $("#btnGroup div:last-child").remove();
    }
  }
}

function uploadFile() {
  var upFile = mm.blobToNoteSequence($("#fileinput")[0].files[0]);
  console.log(upFile);
  upFile.then((sample) => loadSample(sample));
  // console.log(upFile)
  // console.log($('#fileinput')[0].files.length)
}

function loadSample(s) {
  var sets = s.notes;
  // console.log(sets.length)
  Array.prototype.forEach.call(sets, (i) => {
    uploadTransfer(i);
  });
  // sets.foreach(i => console.log(i));
  // console.log(trainedSet)
  unquantizedSeq.totalTime = s.totalTime;
  rnnPlayer.start(unquantizedSeq);
  var qSet = mm.sequences.quantizeNoteSequence(unquantizedSeq, 4);
  console.log(qSet);
}

function uploadTransfer(x) {
  unquantizedSeq.notes.push({
    pitch: x.pitch,
    startTime: x.startTime,
    endTime: x.endTime,
    instrument: x.instrument,
    isDrum: true,
    velocity: 100,
  });
}

function noteOn() {
  // console.log("note")
  var noteFlag = false;
  if (testset.notes.length != 0) {
    var timeIndex = $(this).parent().index();
    // console.log(timeIndex)
    var pitchIndex = drumSet[$(this).index()];
    // console.log(pitchIndex)
    for (note of testset.notes) {
      // console.log(note)
      if (note.quantizedStartStep == timeIndex && note.pitch == pitchIndex) {
        $(this).css("background-color", "#ededed");
        noteFlag = true;
        testset.notes.pop();
      }
    }
  }
  if (noteFlag == false) {
    $(this).css("background-color", "#ff593f");
    testset.notes.push({
      pitch: drumSet[$(this).index()],
      quantizedStartStep: $(this).parent().index() * 1,
      quantizedEndStep: $(this).parent().index() + 1,
      isDrum: true,
      velocity: 100,
    });
    // console.log(testset)
  }
  // console.log($(this).parent().index())
  // console.log($(this).index())
}

function getPlay() {
  player.start(testset);
  console.log(testset);
  // console.log(v)
}

// Initialize the model.
var music_rnn = new mm.MusicRNN(
  "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn"
);
music_rnn.initialize();
var rnn_steps = 32;
var rnn_temperature = 1.5;
// Create a player to play the sequence we'll get from the model.
var rnnPlayer = new mm.SoundFontPlayer(
  "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
);

function musicRnn() {
  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();
    return;
  }
  // The model expects a quantized sequence, and ours was unquantized:
  // const qns = mm.sequences.quantizeNoteSequence(testset, 4);
  music_rnn
    .continueSequence(testset, rnn_steps, rnn_temperature)
    .then((sample) => makeSample(sample));
}

function makeSample(s) {
  let sets = s.notes;
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
    isDrum: true,
    velocity: 100,
  });
}
