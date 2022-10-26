var keyWidth;
var keyWhiteList = [[0, 23, 0], [23, 24, 2], [47, 23, 4], [70, 24, 5], [94, 23, 7], [117, 23, 9], [140, 24, 11]];
var keyBarList = [[14, 14, 1], [42, 14, 3], [83, 14, 6], [110, 13, 8], [137, 14, 10]];
var proportion = 2;
var numberKeys;
var number = 0;
var osc;
var canvas;
var blackKeyEnd = 60;
var lowerHalfKeys = [];
var upperHalfKeys = [];
var drawEnd;
var transpose = 0;
var amplitude = 0.5;
var playing = false;
var stop = true;
var filter;

var env;
var attack_time = 0.01;
var attack_level = amplitude;
var decay_time = 0.1;
var decay_level = amplitude;

var hideSettings = true;

function setup() {
    pianoWidth = window.innerWidth;
    pianoHeight = min(proportion * 100 + 1, windowHeight);
    numberOfKeys = floor(windowWidth / 23 / proportion);
    keyWidth = windowWidth / numberOfKeys;
    canvas = createCanvas(pianoWidth, pianoHeight);
    canvas.parent('piano');
    drawKeyboard(numberOfKeys);
    env = new p5.Envelope(attack_time, attack_level, decay_time, decay_level);
    osc = getOsc('sine');
}

function drawKeyboard(whiteKeysNumber) {
    clear();
    let oneGroupNumber = 7;
    let startX;
    let lastKeys = whiteKeysNumber;
    let blackKeysNumber = 5;
    while (lastKeys > 7) {
        lastKeys -= 7;
    }
    lastKeys = whiteKeysNumber - lastKeys;
    lowerHalfKeys = []
    upperHalfKeys = []
    for (let multiple = 0; multiple < whiteKeysNumber; multiple += 7) {
        fill(255);
        blackKeysNumber = 5;
        if (multiple > whiteKeysNumber - 7) {
            oneGroupNumber = whiteKeysNumber % 7;
            blackKeysNumber = getBlackKeysNumber(oneGroupNumber);
        }
        let x;
        let width;
        let keyGroupCount = (((multiple / 7) >> 0));
        let keyGroupPlacement = (keyGroupCount) * 12
        startX = (keyWhiteList[6][0] + keyWhiteList[6][1]) * keyGroupCount * proportion;
        for (let index = 0; index < oneGroupNumber; index++) {
            rect(startX + keyWhiteList[index][0] * proportion, 0, keyWhiteList[index][1] * proportion, proportion * 100);
            lowerHalfKeys.push([startX + keyWhiteList[index][0] * proportion, startX + (keyWhiteList[index][0] + keyWhiteList[index][1]) * proportion, keyWhiteList[index][2] + keyGroupPlacement]);
        }
        fill(0)
        for (let index = 0; index < blackKeysNumber; index++) {
            x = startX + keyBarList[index][0] * proportion;
            width = keyBarList[index][1] * proportion;

            rect(x, 0, width, proportion * blackKeyEnd);
            upperHalfKeys.push([x, x + width, keyBarList[index][2] + keyGroupPlacement])
        }
        for (let index = 0; index < oneGroupNumber; index++) {
            upperHalfKeys.push([startX + keyWhiteList[index][0] * proportion, startX + (keyWhiteList[index][0] + keyWhiteList[index][1]) * proportion, keyWhiteList[index][2] + keyGroupPlacement])
        }
    }
    drawEnd = lowerHalfKeys[lowerHalfKeys.length - 1];
}

function draw() {
    if (playing) {
        if (touches.length > 0 && touches[touches.length - 1].y < pianoHeight) {
            if (touches[touches.length - 1].y > proportion * blackKeyEnd) {
                for (let index = 0; index < lowerHalfKeys.length; index++) {
                    if (touches[touches.length - 1].x > lowerHalfKeys[index][0] && touches[touches.length - 1].x < lowerHalfKeys[index][1]) {
                        osc.freq(440 * (2 ** (1 / 12)) ** (lowerHalfKeys[index][2] + 3 + transpose));
                        break
                    }
                }
            } else {
                for (let index = 0; index < upperHalfKeys.length; index++) {
                    if (touches[touches.length - 1].x > upperHalfKeys[index][0] && touches[touches.length - 1].x < upperHalfKeys[index][1]) {
                        osc.freq(440 * (2 ** (1 / 12)) ** (upperHalfKeys[index][2] + 3 + transpose));
                        break
                    }
                }
            }
            env.play(osc)
            document.getElementById('touch-detection-text').style.display = 'inline-flex'
            stop = true;
        }
        else if (mouseIsPressed && mouseY < pianoHeight) {
            if (mouseY > proportion * blackKeyEnd) {
                for (let index = 0; index < lowerHalfKeys.length; index++) {
                    if (mouseX > lowerHalfKeys[index][0] && mouseX < lowerHalfKeys[index][1]) {
                        osc.freq(440 * (2 ** (1 / 12)) ** (lowerHalfKeys[index][2] + 3 + transpose));
                        break
                    }
                }
            } else {
                for (let index = 0; index < upperHalfKeys.length; index++) {
                    if (mouseX > upperHalfKeys[index][0] && mouseX < upperHalfKeys[index][1]) {
                        osc.freq(440 * (2 ** (1 / 12)) ** (upperHalfKeys[index][2] + 3 + transpose));
                        break
                    }
                }
            }
            document.getElementById('touch-detection-text').style.display = 'inline-flex'
            env.play(osc)
            stop = true;
        }
        else {
            if (stop) {
                stop = false;
            }
            document.getElementById('touch-detection-text').style.display = 'none'
        }
    }
}

function setTouchDetection() {
    document.getElementById('touch-detection-text').innerHTML = 'touched'
}

function getBlackKeysNumber(whiteKeysNumber) {
    switch (whiteKeysNumber) {
        case 1:
            return 0;
        case 2:
            return 1;
        case 3:
            return 2;
        case 4:
            return 2;
        case 5:
            return 3;
        case 6:
            return 4;
        case 7:
            return 5;
    }
}

function getOsc(waveType) {
    osc = new p5.Oscillator();
    osc.setType(waveType);
    // osc.amp(amplitude);
    return osc;
}
function setWave(select) {
    osc.setType(select.value);
}
function setAmplitude(slider) {
    slider.parentElement.children[2].innerHTML = slider.value;
    amplitude = Number(slider.value) / 100
    attack_level = amplitude;
    decay_level = amplitude;
    env.dLevel = amplitude;
    env.aLevel = amplitude;
    stop = true;
}
function setSize(slider) {
    slider.parentElement.children[2].innerHTML = slider.value
    proportion = Number(slider.value);
    numberOfKeys = floor(windowWidth / 23 / proportion);
    pianoHeight = proportion * 100 + 1;
    resizeCanvas(pianoWidth, pianoHeight)
    drawKeyboard(numberOfKeys)
}
function setTranspose(button, action) {
    if (action == "increase") { transpose += 1 }
    else if (action == "increase-12") { transpose += 12 }
    else if (action == "decrease-12") { transpose -= 12 }
    else { transpose -= 1 }
    button.parentElement.children[3].innerHTML = transpose
}
function setDecayTime(input) {
    decay_time = Number(input.value);
    env.dTime = decay_time;
    stop = true;
}
function setAttackTime(input) {
    attack_time = Number(input.value);
    env.aTime = attack_time;
    stop = true;
}


function turnOnOff(button) {
    playing = !playing
    if (playing) {
        button.innerHTML = 'On'
        button.style.color = "gray"
        osc.amp(0)
        osc.start()
    } else {
        osc.stop()
        button.style.color = "black"
        button.innerHTML = 'Off'
    }
}

function showHideSettings(button) {
    if (hideSettings) {
        // button.innerHTML = 'Settings'
        button.style.color = "gray"
        document.getElementById('settings-out-container').style.display = 'flex';
    } else {
        // button.innerHTML = 'Settings'
        button.style.color = "black"
        document.getElementById('settings-out-container').style.display = 'none';
    }
    hideSettings = !hideSettings
}