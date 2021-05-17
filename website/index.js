const ProjectModel = require('./models/project');
const myArgs = process.argv.slice(2);

if (myArgs[0]=="nogen"){}
else{
let egyprojekt = new ProjectModel();
egyprojekt.name='Első';
egyprojekt.folder="./1";
egyprojekt.active="1";
egyprojekt.save((err)=>{console.log(err);});

let ketprojekt = new ProjectModel();
ketprojekt.name='Második';
ketprojekt.folder="./2";
ketprojekt.active="0";
ketprojekt.save((err)=>{console.log(err);});

let harprojekt = new ProjectModel();
harprojekt.name='Harmadik';
harprojekt.folder="./3";
harprojekt.active="0";
harprojekt.save((err)=>{console.log(err);});
};




const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('static'));
require('./route/index')(app);

app.use((err,req,res,next)=>{
   res.end('Problem occured...');
   console.log(err); 

});

app.listen(3000, function () {
    console.log('Hello :3000');
});