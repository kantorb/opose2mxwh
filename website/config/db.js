const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/jzz6fx',{ useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;