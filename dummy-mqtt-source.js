const THREE = require('./three.min.js');
const U3 = require('./three-utils.js');
const Config = require('./mqtt-config.json');
const mqtt = require('mqtt');
const fs = require('fs');
const myArgs = process.argv.slice(2);
const dir = myArgs[0];
console.log(dir)

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


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function sendSkeleton (bs) {
  
  let myStatus = {
    position: bs
  };
  mqttClient.publish(publishTopic(), JSON.stringify(myStatus), statusPublishOptions);
};


function three_angle(x1,x2,y1,y2)
{
  let a = new THREE.Vector3( x1, y1, 0 );
  let b = new THREE.Vector3( x2, y2, 0 );
  let c = new THREE.Vector3( x2, y1, 0 );
  let d = new THREE.Vector3();
  let e = new THREE.Vector3();
  d.subVectors(b,a).normalize();
  e.subVectors(c,a).normalize();
  //console.log(c);
  let quaternion = new THREE.Quaternion(); 
  //quaternion.setFromAxisAngle( c, Math.PI / 2 );
  quaternion.setFromUnitVectors(e,d);
  console.log(quaternion);
  return quaternion;

}

function angle(x1,x2,y1,y2)
{
  if ((Math.abs(y2-y1)) < 0.001){lower = 0.001}
  else {lower = (Math.abs(y2-y1))};
  let headangle = Math.acos((Math.abs(x2-x1))/lower);
  if (x2>x1)
  {
    if (y2>y1)
    {
      //270-360deg
      return 2*Math.PI-headangle;
    }
    else
    {
      //0-90deg
      return headangle;
    }
  }
  else
  {
    if (y2>y1)
    {
      //180-270
      return Math.PI+headangle
    }
    else
    {
      //90-180
      return Math.PI-headangle
    }
  }
}

function centrpnt(x1,x2,y1,y2)
{
  y1=1000-y1;
  y2=1000-y2;
  x_cnt=(x2-x1)/2;
  y_cnt=(y2-y1)/2;
  return [x1+x_cnt, y1+y_cnt];
}

function relpos(x1,xa,y1,ya)
{
  x_rel=xa-x1;
  y_rel=ya-y1;
  return [x_rel, y_rel];
}

function rad_to_deg(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function readFileNum() {
  let filecount =0;
  filecount = fs.readdirSync(dir).length
  return filecount;
};

function getFPSnum() {
  if (myArgs[1] !== undefined && myArgs[1] > 0){FPS=parseInt(myArgs[1]);}
  else
  {
    let diff=0;
    dirElementNum=readFileNum();
    diff=dirElementNum-lastDirElementNum;
    lastDirElementNum=dirElementNum;
    console.log(diff);
    FPS=diff;
  }
};


async function readKeypoints() {
  let current=lastTarget;
  let zerostoadd=0;
  if (FPS>0) {
    target=lastTarget+FPS;
    lastTarget=target;
    console.log('Current target is '+target+', current value is '+current);
    while (current < target && FPS > 0) {
      zerostoadd=12-current.toString().length;
      //console.log(zeroString.substring(0,zerostoadd)+current.toString()+'          '+zerostoadd+' because  '+current+'  '+current.toString().length);
      var obj = JSON.parse(fs.readFileSync(dir+'/'+zeroString.substring(0,zerostoadd)+current.toString()+'_keypoints.json', 'utf8'));
      //var parsed = JSON.parse(obj);
      try {
        parsed=obj.people[0]
        //console.log("    asdsadsad     "+parsed.pose_keypoints_2d);
      } catch (error) {
        console.log('No people in file');
      }
      try {
        bs = {
          'CurrentNum': current,
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
          'MidHipY': parsed.pose_keypoints_2d[25],
          'RHipX': parsed.pose_keypoints_2d[27],
          'RHipY': parsed.pose_keypoints_2d[28],
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
        //head orientation
        let curr_angle = rad_to_deg(angle(parsed.pose_keypoints_2d[0],parsed.pose_keypoints_2d[3],parsed.pose_keypoints_2d[1],parsed.pose_keypoints_2d[4]))
        //console.log("Headangle: "+curr_angle+"    "+parsed.pose_keypoints_2d[3]+"    "+parsed.pose_keypoints_2d[0]+"    "+parsed.pose_keypoints_2d[4]+"    "+parsed.pose_keypoints_2d[1]);
        //console.log(centrpnt(parsed.pose_keypoints_2d[0],parsed.pose_keypoints_2d[3],parsed.pose_keypoints_2d[1],parsed.pose_keypoints_2d[4]));

        let head=[bs.NoseX,1000-bs.NoseY,three_angle(bs.NoseX,bs.NeckX,bs.NoseY,bs.NeckY)];
        let left_upper_arm=[...centrpnt(bs.LShoulderX,bs.LElbowX,bs.LShoulderY,bs.LElbowY),three_angle(bs.LShoulderX,bs.LElbowX,bs.LShoulderY,bs.LElbowY)];
        let left_lower_arm=[...centrpnt(bs.LElbowX,bs.LWristX,bs.LElbowY,bs.LWristY),three_angle(bs.LElbowX,bs.LWristX,bs.LElbowY,bs.LWristY)];
        let right_upper_arm=[...centrpnt(bs.RShoulderX,bs.RElbowX,bs.RShoulderY,bs.RElbowY),three_angle(bs.RShoulderX,bs.RElbowX,bs.RShoulderY,bs.RElbowY)];
        let right_lower_arm=[...centrpnt(bs.RElbowX,bs.RWristX,bs.RElbowY,bs.RWristY),three_angle(bs.RElbowX,bs.RWristX,bs.RElbowY,bs.RWristY)];
        let left_upper_leg=[...centrpnt(bs.LHipX,bs.LKneeX,bs.LHipY,bs.LKneeY),three_angle(bs.LHipX,bs.LKneeX,bs.LHipY,bs.LKneeY)];
        let left_lower_leg=[...centrpnt(bs.LKneeX,bs.LAnkleX,bs.LKneeY,bs.LAnkleY),three_angle(bs.LKneeX,bs.LAnkleX,bs.LKneeY,bs.LAnkleY)];
        let right_upper_leg=[...centrpnt(bs.RHipX,bs.RKneeX,bs.RHipY,bs.RKneeY),three_angle(bs.RHipX,bs.RKneeX,bs.RHipY,bs.RKneeY)];
        let right_lower_leg=[...centrpnt(bs.RKneeX,bs.RAnkleX,bs.RKneeY,bs.RAnkleY),three_angle(bs.RKneeX,bs.RAnkleX,bs.RKneeY,bs.RAnkleY)];
        let torso=[...centrpnt(bs.NeckX,bs.MidHipX,bs.NeckY,bs.MidHipY),three_angle(bs.NeckX,bs.MidHipX,bs.NeckY,bs.MidHipY)];

        //console.log(three_angle(bs.NoseX,bs.NeckX,bs.NoseY,bs.NeckY));
        //console.log(three_angle(bs.LShoulderX,bs.LElbowX,bs.LShoulderY,bs.LElbowY));
        //console.log(three_angle(bs.LElbowX,bs.LWristX,bs.LElbowY,bs.LWristY));

        toSend = {
          'head' : head,
          'left_upper_arm' : left_upper_arm,
          'left_lower_arm' : left_lower_arm,
          'right_upper_arm' : right_upper_arm,
          'right_lower_arm' : right_lower_arm,
          'left_upper_leg' : left_upper_leg,
          'left_lower_leg' : left_lower_leg,
          'right_upper_leg' : right_upper_leg,
          'right_lower_leg' : right_lower_leg,
          'torso' : torso
        };
        //console.log(head,left_upper_arm,left_lower_arm,right_upper_arm,right_lower_arm,left_upper_leg,left_lower_leg,right_upper_leg,right_lower_leg,torso);

        //console.log(bs);
        //console.log(toSend);
        console.log(current)
        //await sleep(500);
        sendSkeleton(toSend);
      } catch (error) {
        console.log('No people in file'+"  "+error);
      }
      
      current++;
    }
  }
  else {
    console.log('There is no capture running at the moment');
  };
  
};


//var periodicUpdate = setInterval(sendSkeleton, 1000);
//var periodicUpdate2 = setInterval(getFPSnum, 1000);
var periodicUpdate2 = setInterval(getFPSnum, 100);
var periodicUpdate3 = setInterval(readKeypoints, 1000);

