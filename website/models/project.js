const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Project = db.model('Project', {
  name: String,
  folder: String,
  active: Number
});

module.exports = Project;