// first declare variables to be used in the program

var micInput;
var fft;
var frameWait = 1;

var x1 = 350;
var y1 = 350;
var x2 = 350;
var y2 = 350;

var record;
var audio;
var vol;
var loop;

var playState = 0;

var lowFilter;
var highFilter;
var filter;

var masterRecord;
var masterBuffer;

//preload is being used just to declare variables as objects before the program initializes
function preload(){
  micInput = new p5.AudioIn();
  micInput.start();
  fft = new p5.FFT(0.8, 512);
  fft.setInput(micInput);
  record = new p5.SoundRecorder();
  audio = new p5.SoundFile();
  masterRecord = new p5.SoundRecorder();
  masterBuffer = new p5.SoundFile();
  lowFilter = new p5.LowPass();
  highFilter = new p5.HighPass();
}

//setup function is used to declare most of the basic visual aspects
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  record.setInput(micInput);
  button = createButton('Record');
  button.position(20,30);
  button.mousePressed(masterBuff);
  button2 = createButton('Stop Recording');
  button2.position(20, 80);
  button2.mousePressed(masterStop);
  button3 = createButton('Save');
  button3.position(20, 130);
  button3.mousePressed(masterSave);
}

function draw() {
  background(0, 20)
  var spectrum = fft.analyze();
  vol = micInput.getLevel();
  //if the input level of the microphone is above a certain level OR if playback is active then generate "lines"
  if(vol > 0.05 && (frameCount%frameWait === 0)){
    new lineGenerator();
  }
  if(audio.isPlaying()){
    new lineGenerator();
  }

  //if volume is over a certain point then begin recording. once it falls back below then it's processed and played back
  if(vol > 0.1){
    record.record(audio);
    console.log('recording');
    playState = 1;
  }
  if(playState === 1 && vol < 0.1){
    new recordStop();
    new playAudio();
    playState = 0;
  }
}

//object built to draw a line beginning at the location of the last one
function lineGenerator(){
  stroke(color(random(0, 100),random(100, 200),random(140, 230)));
  strokeWeight(3);
  line(x1, y1, x2, y2);
  if(x2 > windowWidth){
    x2 = 0;
  }
  if(x2 < 0){
    x2 = windowWidth;
  }
  if(y2 > windowHeight){
    y2 = 0;
  }
  if(y2 < 0){
    y2 = windowHeight;
  }
  x1 = x2;
  y1= y2;
  x2 = x1 + (random(-20,20));
  y2 = y1 + (random(-20,20));
}

//all the next functions are for different jobs, pertaining to organising and playing audio
function audioBuff(){
  record.record(audio);
  console.log('recording');
}

function masterBuff(){
  masterRecord.record(masterBuffer);
  console.log('recording Master')
}

function recordStop(){
  record.stop();
  console.log('stopped recording');
}

function masterStop(){
  masterRecord.stop();
  console.log('master stopped');
}

function masterSave(){
  saveSound(masterBuffer, 'inputAudio.wav');
  console.log('saving!!');
}

//this function applies filters and other effects to the audio before it's played back
function playAudio(){
  var numPicked = int(random (0,2));
  console.log(numPicked + 'number picked');
  lowFilter.set(random(100,3000), 50);
  highFilter.set(random(2000,15000), 50);
  audio.disconnect();
  if(numPicked === 0){
    filter = numPicked
  }
  if(numPicked === 1){
    filter = numPicked
  }
  console.log(filter + 'filter number')
  if(filter === 0){
    audio.connect(lowFilter);
  }
  if(filter === 1){
    audio.connect(highFilter);
  }
  audio.setVolume(0.5);
  audio.play();
  loop = new p5.SoundLoop(function(timeFromNow){
    audio.play(timeFromNow);
  }, 2);
  loop.maxIterations = (random(3,6));
  loop.start();
  console.log('playing!');
}
