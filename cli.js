#!/usr/bin/env node

var meow = require('meow');
var empaticaConnect = require('./');

var cli = meow({
  help: [
    'Usage',
    '  $ empatica-connect [bandId]',
    '',
    'Examples',
    '  $ empatica-connect A00182-E4',
    '  band data'
  ]
});

empaticaConnect(cli.input[0], function (data) {
  console.log(data);
},
function (data) {
  console.log(data);
});
