//constants
var osc;
var keyWidth;
var pianoWidth;
var pianoHeight
var numberOfKeys;
var canvas;

function getOsc(waveType){
	osc = new p5.Oscillator();
	osc.setType(waveType);
	osc.amp(0.5);
	return osc;
}

function getBlackKeys(notes){
	var blackKeys = [];
	var blackKeysRecipie = [1,3,6,8,10];
	for(var i=0;i<numberOfKeys;i++){
		if(blackKeysRecipie.indexOf(i%12) > -1){
			blackKeys.push(i);
		}
	}
	return blackKeys;	
}

function playWithTouch(){
	osc.freq(440*(2**(1/12))**Math.floor(map(mouseX,0,pianoWidth,3,numberOfKeys+3)));
}

function setup(){
	pianoWidth = window.innerWidth;
	pianoHeight = window.innerHeight*0.6;
	keyWidth = 50;
	numberOfKeys = windowWidth/keyWidth;
	keyWidth = windowWidth/numberOfKeys;
	blackKeys = getBlackKeys(numberOfKeys);
	canvas = createCanvas(pianoWidth,pianoHeight);
	canvas.parent('piano')
	for(var i=0;i<numberOfKeys*2;i++){
		fill(255);
		if(blackKeys.indexOf(i) > -1){
			fill(0);
		}
		rect(i*keyWidth,0,keyWidth,pianoHeight-1);
	}
	osc = getOsc("sine");
}

function draw(){
	playWithTouch();
}

function setWave(select){
	osc.setType(select.value);
}
function setAmplitude(slider){
	console.log(slider.parentElement.children[2].innerHTML = slider.value)
	osc.amp(Number(slider.value)/100);
}


function mousePressed(){
	if(mouseY<pianoHeight){
		osc.start();
	}
}

function mouseReleased(){
	osc.stop();
}
