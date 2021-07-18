drumSet = [36, 38, 42, 46, 50, 45, 48]
DRUMS = {
    notes: [
        { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, program:10 },
        { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, program: 15},
        { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, program: 20 },
        { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, program: 15 },
        { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, program: 10 },
        { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, program: 10 },
        { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, program: 1 },
        { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, program: 0 },
        { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, program: 0 },
        { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, program: 10},
        { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, program: 20 },
        { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, program: 20 },
        { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, program: 10 },
        { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, program: 10 },
        { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, program: 10 },
        { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, program: 10 },
        { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, program: 10 },
        { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, program: 10 },
        // { pitch: 60, quantizedStartStep: 0, quantizedEndStep: 1, },
        // { pitch: 60, quantizedStartStep: 1, quantizedEndStep: 2 },
        // { pitch: 67, quantizedStartStep: 2, quantizedEndStep: 3 },
        // { pitch: 67, quantizedStartStep: 3, quantizedEndStep: 4 },

    ],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 11
};
DrumsTest={
    notes: [
        { pitch:0 , quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true }
    ],
    quantizationInfo: { stepsPerQuarter: 4 },
    tempos: [{ time: 0, qpm: 120 }],
    totalQuantizedSteps: 1
}

$('button').on('click',feedback)
var player1 =new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
function feedback() {
    DrumsTest.notes[0].pitch= $(this).val()
    player1.start(DrumsTest)

}

// player2.start(TWINKLE_TWINKLE)
