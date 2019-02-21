//constants
var osc;
var keyWidth;
var numberOfKeys = 30;
var sel;

function getOsc(waveType){
	osc = new p5.Oscillator();
	osc.setType(waveType);
	osc.amp(1);
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
	osc.freq(440*(2**(1/12))**Math.floor(map(mouseX,0,windowWidth,3,numberOfKeys+3)));
}

function setup(){
	sel = createSelect();
	sel.position(0,410);
	sel.option("sine");
	sel.option("triangle");
	sel.option("square");
	sel.option("sawtooth");
	sel.changed(getWave);
	keyWidth = windowWidth/numberOfKeys;
	blackKeys = getBlackKeys(numberOfKeys);
	createCanvas(windowWidth,windowHeight);
	for(var i=0;i<numberOfKeys*2;i++){
		fill(255);
		if(blackKeys.indexOf(i) > -1){
			fill(0);
		}
		rect(i*keyWidth,0,keyWidth,400);
	}
	osc = getOsc("sine");
}

function draw(){
	playWithTouch();
}

function getWave(){
	var item = sel.value();
	osc.setType(item);
}
function mousePressed(){
	if(mouseY<400){
		osc.start();
	}
}

function mouseReleased(){
	osc.stop();
}
