# OpenPose to Maxwhere Interface 

This is my project for the Information Technology of Cyberphysical Systems course at University of Technology and Economics Budapest. My neptun code starts with JZ.

The goal for this project is to provide a simple way for people to get their skeletons in to Maxwhere conferences and lessons, so it actually feels like they are there.

Link to MaxWhere: [https://www.maxwhere.com/](https://www.maxwhere.com/)

## Install
1. Download [Openpose](https://github.com/CMU-Perceptual-Computing-Lab/openpose), and configure it according to their [guide](https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/installation/0_index.md#windows-portable-demo)
2. Clone this project in the directory of your choice
3. Change the `dir` variable in line 6 in the `dummy-mqtt-source.json` file to the openpose keypoints directory (probably `{openpose_folder}/keypoints`)
1. Run `npm i` to install dependencies.
2. Rename `mqtt-config.json.example` to `mqtt-config.json` and change settings accordingly to your setup.
3. Start openpose, example command: `bin\OpenPoseDemo.exe --write_json keypoints/ --tracking 1 --number_people_max 1 --net_resolution -1x128` (make sure you start it from the openpose root folder, else it will fail, beacuse it couldn't find the models)
4. Start this script: `node dummy-mqtt-source.js`