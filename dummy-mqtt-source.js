const THREE = require('./three.min.js');
const U3 = require('./three-utils.js');
const Config = require('./mqtt-config.json');
const mqtt = require('mqtt');
const fs = require('fs');
const { waitForDebugger } = require('inspector');
const { setTimeout } = require('timers');
const dir = '../keypoints';

var currentPos = { 'x': 0, 'y': 200, 'z': 0 } // Initial position
var QcurrentOri = new THREE.Quaternion(0, 0, 0, 1)
var dirElementNum = 0;
var lastDirElementNum = 0;
let FPS = 0;
let target=0;
let lastTarget=0;
let zeroString='000000000000';

const appID = 'kantorb_position'
const ControlMessageString = '_'

const mqqtOptions = {
  'username': Config.mqttUser,
  'password': Config.mqttPassword,
  'clean': true,
  'keepalive': 60,
  'protocolVersion': 5,
  'queueQoSZero': false,
  'properties': {
    'sessionExpiryInterval': 0
  }
};

const statusPublishOptions = {
  'properties': {
    'messageExpiryInterval': 3
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const publishTopic = () => { return (`${appID}`) };
var mqttClient = mqtt.connect(Config.mqttServerUrl, mqqtOptions);

function sendStatus () {
  QcurrentOri = QcurrentOri.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 1) * 0.02));
  let deltaPos = new THREE.Vector3(0, 0, 1).applyQuaternion(QcurrentOri).multiplyScalar((Math.random() - 1) * 5.0);

  currentPos = { 'x': currentPos.x + deltaPos.x,
    'y': currentPos.y + deltaPos.y,
    'z': currentPos.z + deltaPos.z};

  let myStatus = {
    position: currentPos,
    orientation: U3.OriFromQ(QcurrentOri)
  };
  mqttClient.publish(publishTopic(), JSON.stringify(myStatus), statusPublishOptions);
};
function readFileNum() {
  let filecount =0;
  filecount = fs.readdirSync(dir).length
  return filecount;
};

function getFPSnum() {
  let diff=0;
  dirElementNum=readFileNum();
  diff=dirElementNum-lastDirElementNum;
  lastDirElementNum=dirElementNum;
  console.log(diff);
  FPS=diff;
};


function readKeypoints() {
  let current=lastTarget;
  let zerostoadd=0;
  if (FPS>0) {
    target=lastTarget+FPS;
    lastTarget=target;
    toSleep=Math.round(1000/FPS)
    console.log('Current target is '+target+', current value is '+current);
      while (current < target && FPS > 0) {
        zerostoadd=12-current.toString().length;
        console.log(zeroString.substring(0,zerostoadd)+current.toString()+'          '+zerostoadd+' because  '+current+'  '+current.toString().length);
        current++;
      }
  }
  else {
    console.log('There is no capture running at the moment');
  };

};


var periodicUpdate = setInterval(sendStatus, 50);
var periodicUpdate = setInterval(getFPSnum, 1000);
var periodicUpdate2 = setInterval(readKeypoints, 1000);

