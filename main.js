//constants
var osc;
var keyWidth;
var numberOfKeys = 36;
var sel;

function getOsc(waveType){
	osc = new p5.Oscillator();
	osc.setType(waveType);
	osc.amp(1);
	return osc;
}

function getBlackKeys(notes){
	var blackKeys = [];
	var blackKeysRecipie = [1,3,5,8,10];
	for(var i=0;i<numberOfKeys;i++){
		if(blackKeysRecipie.indexOf(i%12) > -1){
			blackKeys.push(i);
		}
	}
	return blackKeys;	
}

function playWithTouch(){
	if (mouseY>=250)
	{
		// console.log(mouseX);
		var value = Math.floor(map(mouseX,0,windowWidth,0,numberOfKeys*7/12));
		var note = (value%7)*2-Math.floor((value%7)/4)+12*Math.floor(value/7);
		var freq = 440*(2**(1/12))**(note-4);
		console.log(value," ",note," ",freq);
		osc.freq(freq);
	}
}

function setup(){
	sel = createSelect();
	sel.position(0,410);
	sel.option("sine");
	sel.option("triangle");
	sel.option("square");
	sel.option("sawtooth");
	sel.changed(getWave);
	keyWidth = windowWidth/(numberOfKeys*(7/12));
	blackKeys = getBlackKeys(numberOfKeys);
	createCanvas(windowWidth,windowHeight);
	var hello = Array();
	//white keys
	fill(255);
	for(var i=0;i<numberOfKeys*(7/12);i++)
	{
		rect(i*keyWidth,0,keyWidth,400);
	}
	fill(0);
	for(var i=0;i<numberOfKeys;i++)
	{
		if(blackKeys.indexOf(i) > -1)
		{
			rect(i*keyWidth*(583/1000),0,keyWidth*0.5,250);
		}
		else
		{
			hello.push(i);
		}
	}
	console.log(hello);
	// for(var i=0;numberOfKeys*2;i++)
	// {
	// 	rect(i*keyWidth*0.5,0,keyWidth*0.5,250);
	// }
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
	if(mouseY>=250){
		osc.start();
	}
}

function mouseReleased(){
	osc.stop();
}
