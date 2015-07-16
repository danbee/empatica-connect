'use strict';

var request = require('request');

var request = request.defaults({ jar: true });

var userForm = { username: process.env.EMPATICA_USERNAME,
                 password: process.env.EMPATICA_PASSWORD };

var empaticaConnect = function (bandId, success, error) {

  request

    .post('https://www.empatica.com/connect/caramba.php', { form: userForm })

    .on('response', function (response) {
      // We should be signed in.
      // The site redirects back to login.php before redirecting to the dashboard
      // so there is no obvious way to figure out if the log in was successful.
      request.get('https://www.empatica.com/connect/connect.php/users/11321/sessions?from=1436828400&to=1436914799', function (error, response, body) {
        success(body);
      });
    })

    .on('error', function (response) {
    });

};

module.exports = empaticaConnect;
