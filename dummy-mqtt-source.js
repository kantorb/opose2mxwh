const THREE = require('./three.min.js');
const U3 = require('./three-utils.js');
const Config = require('./mqtt-config.json');
const mqtt = require('mqtt');
const fs = require('fs');
const dir = '../keypoints';

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


const publishTopic = () => { return (`${appID}`) };
var mqttClient = mqtt.connect(Config.mqttServerUrl, mqqtOptions);


function sendSkeleton (bodyparts) {

  let myStatus = {
    position: bodyparts
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
    console.log('Current target is '+target+', current value is '+current);
      while (current < target && FPS > 0) {
        zerostoadd=12-current.toString().length;
        //console.log(zeroString.substring(0,zerostoadd)+current.toString()+'          '+zerostoadd+' because  '+current+'  '+current.toString().length);
        var obj = JSON.parse(fs.readFileSync('../keypoints/'+zeroString.substring(0,zerostoadd)+current.toString()+'_keypoints.json', 'utf8'));
        //var parsed = JSON.parse(obj);
        try {
          parsed=obj.people[0]
          //console.log(parsed.pose_keypoints_2d);
        } catch (error) {
          console.log('No people in file');
        }
        try {
          bodyparts = {
            'NoseX': parsed.pose_keypoints_2d[0],
            'NoseY': parsed.pose_keypoints_2d[1],
            'NeckX': parsed.pose_keypoints_2d[3],
            'NeckY': parsed.pose_keypoints_2d[4],
            'RShoulderX': parsed.pose_keypoints_2d[6],
            'RShoulderY': parsed.pose_keypoints_2d[7],
            'RElbowX': parsed.pose_keypoints_2d[9],
            'RElbowY': parsed.pose_keypoints_2d[10],
            'RWristX': parsed.pose_keypoints_2d[12],
            'RWristY': parsed.pose_keypoints_2d[13],
            'LShoulderX': parsed.pose_keypoints_2d[15],
            'LShoulderY': parsed.pose_keypoints_2d[16],
            'LElbowX': parsed.pose_keypoints_2d[18],
            'LElbowY': parsed.pose_keypoints_2d[19],
            'LWristX': parsed.pose_keypoints_2d[21],
            'LWristY': parsed.pose_keypoints_2d[22],
            'MidHipX': parsed.pose_keypoints_2d[24],
            'MidhipY': parsed.pose_keypoints_2d[25],
            'RHipX': parsed.pose_keypoints_2d[27],
            'RhipY': parsed.pose_keypoints_2d[28],
            'RKneeX': parsed.pose_keypoints_2d[30],
            'RKneeY': parsed.pose_keypoints_2d[31],
            'RAnkleX': parsed.pose_keypoints_2d[33],
            'RAnkleY': parsed.pose_keypoints_2d[34],
            'LHipX': parsed.pose_keypoints_2d[36],
            'LHipY': parsed.pose_keypoints_2d[37],
            'LKneeX': parsed.pose_keypoints_2d[39],
            'LKneeY': parsed.pose_keypoints_2d[40],
            'LAnkleX': parsed.pose_keypoints_2d[42],
            'LAnkleY': parsed.pose_keypoints_2d[43],
            'REyeX': parsed.pose_keypoints_2d[45],
            'REyeY': parsed.pose_keypoints_2d[46],
            'LEyeX': parsed.pose_keypoints_2d[48],
            'LEyeY': parsed.pose_keypoints_2d[49],
            'REarX': parsed.pose_keypoints_2d[51],
            'REarY': parsed.pose_keypoints_2d[52],
            'LEarX': parsed.pose_keypoints_2d[54],
            'LEarY': parsed.pose_keypoints_2d[55],
            'LBigToeX': parsed.pose_keypoints_2d[57],
            'LBigToeY': parsed.pose_keypoints_2d[58],
            'LSmallToeX': parsed.pose_keypoints_2d[60],
            'LSmallToeY': parsed.pose_keypoints_2d[61],
            'LHeelX': parsed.pose_keypoints_2d[63],
            'LHeelY': parsed.pose_keypoints_2d[64],
            'RBigToeX': parsed.pose_keypoints_2d[66],
            'RBigToeY': parsed.pose_keypoints_2d[67],
            'RSmallToeX': parsed.pose_keypoints_2d[69],
            'RSmallToeY': parsed.pose_keypoints_2d[70],
            'RHeelX': parsed.pose_keypoints_2d[72],
            'RheelY': parsed.pose_keypoints_2d[73],
            //'BackgroundX': parsed.pose_keypoints_2d[75],
            //'BackgroundY': parsed.pose_keypoints_2d[76]
          };
          console.log(bodyparts);
          sendSkeleton(bodyparts);
        } catch (error) {
          console.log('No people in file');
        }
        
        current++;
      }
  }
  else {
    console.log('There is no capture running at the moment');
  };

};


//var periodicUpdate = setInterval(sendSkeleton, 1000);
var periodicUpdate2 = setInterval(getFPSnum, 1000);
var periodicUpdate3 = setInterval(readKeypoints, 1000);

