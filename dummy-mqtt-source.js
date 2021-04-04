const THREE = require('./three.min.js');
const U3 = require('./three-utils.js');
const Config = require('./mqtt-config.json');
const mqtt = require('mqtt');
const fs = require('fs');
const dir = '../keypoints';

var currentPos = { 'x': 0, 'y': 200, 'z': 0 } // Initial position
var QcurrentOri = new THREE.Quaternion(0, 0, 0, 1)
var dirElementNum = 0;
var lastDirElementNum = 0;
let FPS = 0;
let target=0;
let lastTarget=0;

const appID = 'bkantor_position'
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

function asasdasd() {
  console.log(FPS);
};


//var periodicUpdate = setInterval(sendStatus, 50);
var periodicUpdate = setInterval(getFPSnum, 1000);
var periodicUpdate2 = setInterval(asasdasd, 1000);
