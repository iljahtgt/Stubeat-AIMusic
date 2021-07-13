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

drumSet = [36, 38, 42, 46, 50, 45, 48]
testset = {
    ontrolChanges: [],
    keySignatures: [],
    notes: [
    ],
    partInfos: [],
    pitchBends: [],
    quantizationInfo: { stepsPerQuarter: 4 },
    sectionAnnotations: [],
    sectionGroups: [],
    tempos: [{ time: 0, qpm: 120 }],
    textAnnotations: [],
    timeSignatures: [],
    totalQuantizedSteps: 32
};
var trainedSet = {
    ontrolChanges: [],
    keySignatures: [],
    notes: [
    ],
    partInfos: [],
    pitchBends: [],
    quantizationInfo: { stepsPerQuarter: 4 },
    sectionAnnotations: [],
    sectionGroups: [],
    tempos: [{ time: 0, qpm: 120 }],
    textAnnotations: [],
    timeSignatures: [],
    totalQuantizedSteps: 32
};


player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');

init();
function init() {
    $('.soundBtn').on("click", noteOn);
    $('#play').on("click", getPlay);
    $('#savebtn').on("click", () => saveAs(new File([mm.sequenceProtoToMidi(testset)], 'usr_sample.mid')));
    $('#saveTrainedbtn').on("click", () => saveAs(new File([mm.sequenceProtoToMidi(trainedSet)], 'rnn_sample.mid')));
    $('#generate').on("click", musicRnn)
}




function noteOn() {
    // console.log("note")
    // console.log(`${drumSet[$(this).index()]} ${$(this).index()}`);
    // console.log($(this).parent().attr('id'));

    var flag = false;

    if (testset.notes.length != 0) {
        var index = $(this).parent().index(); 
        var pitch = drumSet[$(this).index()];
        for (note of testset.notes) {
            if (note.quantizedStartStep == index && note.pitch == pitch) {
                $(this).css("background-color", "#ededed");
                flag = true;
                testset.notes.pop();

            };

        };
    }

    if (flag == false) {
        $(this).css("background-color", "#ff593f");
        testset.notes.push({ pitch: drumSet[$(this).index()], quantizedStartStep: $(this).parent().index() * 1, quantizedEndStep: $(this).parent().index() + 1, isDrum: true, velocity: 100 })
    };

    console.log(testset)
    // console.log($(this).parent().index())
    // console.log($(this).index())
}

function getPlay() {

    player.start(testset);
    console.log(testset)
}

// Initialize the model.
music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn');
music_rnn.initialize();
rnn_steps = 32;
rnn_temperature = 1.5;
// Create a player to play the sequence we'll get from the model.
rnnPlayer = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');

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
    var sets = s.notes
    // console.log(sets.length)
    Array.prototype.forEach.call(sets, i => { transferNotes(i) })
    // sets.foreach(i => console.log(i));
    // console.log(trainedSet)
    trainedSet.quantizationInfo = s.quantizationInfo
    trainedSet.tempos = s.tempos
    trainedSet.totalQuantizedSteps = s.totalQuantizedSteps
    rnnPlayer.start(trainedSet)
}

function transferNotes(x) {
    trainedSet.notes.push({ pitch: x.pitch, quantizedStartStep: x.quantizedStartStep, quantizedEndStep: x.quantizedEndStep, isDrum: true, velocity: 100 })


}

$('#sampleBefore').click(()=>{
    var reader = new FileReader('/samples/Sample_before.mid');
    var m = mm.midiToSequenceProto(reader.result);
    console.log(m);
    var player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
});

