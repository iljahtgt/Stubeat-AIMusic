var axisX;
var mflag = true;
var player = new mm.SoundFontPlayer(
  "https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
);

var varialTrackSet = []; //  還會變動的sample集
var totalTrack = {
  // 最後要播放的Set
  notes: [],
  quantizationInfo: { stepsPerQuarter: 4 },
  tempos: [{ time: 0, qpm: 120 }],
  totalQuantizedSteps: 1700,
};
// var currentSet = [
//   { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
//   { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
//   { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
//   { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
//   { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
//   { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
//   { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
//   { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
//   { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
//   { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
//   { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
//   { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
//   { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
//   { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
//   { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
//   { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
//   { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
//   { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
// ]; // 目前正在修改的sample

document.addEventListener("mousemove", (event) => {
  axisX = event.clientX;
  // console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
});
init();
function init() {
  $("#qpmRange").on("change", qpmRangeChange);
  $("#qpmInput").on("change", qpmInputChange);
  $("#playBtn").on("click", playAll);
  $("#generateBtn").on("click", generateFlag);
  $("rect")
    .on("mousedown", setMove)
    .on("mouseup", moveflag)
    .on("mouseout", () => (mflag = false));

  $(".channelTrack").on("click", generateSample);
}

// qpm diplay
function qpmRangeChange() {
  $("#qpmInput").val($(this).val());
  totalTrack.tempos[0].qpm = $(this).val();
}
function qpmInputChange() {
  $("#qpmRange").val($(this).val());
  totalTrack.tempos[0].qpm = $(this).val();
}

// generate a sample on a track--------------------
var sampleNum = [];
var gFlag = false;
function generateFlag() {
  if (gFlag == false) {
    gFlag = true;
    $("#generateBtn").css("background-color", "#ff593f");
    $(".channelTrack").css("pointer-events", "visible");
  } else {
    gFlag = false;
    $("#generateBtn").css("background-color", "#FFFFFF");
    $(".channelTrack").css("pointer-events", "none");
    $("rect").css("pointer-events", "visible");
    $("rect")
      .on("mousedown", setMove)
      .on("mouseup", moveflag)
      .on("mouseout", () => (mflag = false));
  }
}



function generateSample() {
  console.log(userSample[0].notes);

  var currentUserSample = userSample[0].notes;

  var s = $(this).html();
  var num = currentUserSample.length;
  if (gFlag == true) {
    s +=
      "<rect  x='" +
      (axisX - 200 - currentUserSample.length / 2) +
      "'value='" +
      num +
      "' width='" +
      currentUserSample[currentUserSample.length - 1].quantizedEndStep +
      "'></rect>";
    $(this).html(s);
    console.log(currentUserSample);
    sampleNum.push(sampleNum.length);
    varialTrackSet.push(currentUserSample);
    console.log(varialTrackSet)
    // console.log(sampleNum)
  }
  // console.log($(this).attr("class"))
  // console.log($(this).css("z-index"))
}

// move sample--------------------------------------
var xPoint;
function setMove() {
  console.log("setMove");
  mflag = true;
  $(this).on("mousemove", setIsMoving);
}
function moveflag() {
  // console.log(currentSet);
  xPoint = parseInt($(this).attr("x"));
  for (note of currentUserSample) {
    var notePoint = Math.round(xPoint / 4) + note.quantizedStartStep;
    var nPointEnd = Math.round(xPoint / 4) + note.quantizedEndStep;
    note.quantizedStartStep = notePoint;
    note.quantizedEndStep = nPointEnd;
  }
  varialTrackSet[$(this).attr("value")] = currentUserSample;
  // console.log(varialTrackSet);
  // console.log(currentSet);
  // currentSet = [
  //   { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
  //   { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
  //   { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
  //   { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
  //   { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
  //   { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
  //   { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
  //   { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
  //   { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
  //   { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
  //   { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
  //   { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
  //   { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
  //   { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
  //   { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
  //   { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
  //   { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
  //   { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
  // ];
  console.log(currentSet);
  mflag = false;
}

function setIsMoving() {
  if (mflag == true) {
    var setWidth = parseInt($(this).css("width"));
    $(this).attr("x", axisX - 200 - setWidth / 2);
  }
  // console.log($(this).attr('x'))
  // console.log($('.channel').css('width'))
}

// play music-----------------------------------------
function playAll() {

  totalTrack = {
    // 最後要播放的Set
    notes: [],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 1700,
  };

  for (note of varialTrackSet) {
    for (i = 0; i < note.length; i++) {
      totalTrack.notes.push(note[i]);
    }
  }
  console.log('=======================================')
  console.log(totalTrack);
  if (player.isPlaying()) {
    player.stop();
    $("#playBtn").html("Play");
  } else {
    player.start(totalTrack);
    $("#playBtn").html("Stop");
  }
}

// select music-----------------------------------------
var userSample = [];
function selectMusic(id) {
  userSample = [];
  console.log(id);
  var set = musicList[id];
  userSample.push(set);
  console.log(userSample);
}
