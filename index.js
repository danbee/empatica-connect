'use strict';

var request = require('request');

var request = request.defaults({ jar: true });

var userForm = { username: process.env.EMPATICA_USERNAME,
                 password: process.env.EMPATICA_PASSWORD };

var signIn = function (bandId, callback) {
}

var getSessions = function (bandId) {
  console.log(bandId);
}

var empaticaConnect = function (bandId, success, error) {
  request.post('https://www.empatica.com/connect/caramba.php', { form: userForm })

    .on('response', function (response) {
      // We should be signed in.
      // The site redirects back to login.php before redirecting to the dashboard
      // so there is no obvious way to figure out if the log in was successful.
    })

    .on('error', function (response) {
    });
};

module.exports = empaticaConnect;
