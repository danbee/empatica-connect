'use strict';

var request = require('request');
var moment = require('moment');

var empaticaUtils = require('./lib/empatica/utils.js');

var request = request.defaults({ jar: true });

var userForm = { username: process.env.EMPATICA_USERNAME,
                 password: process.env.EMPATICA_PASSWORD };

var empaticaConnect = {
  getLastSession: function (bandId, success, error) {
    request
    .post('https://www.empatica.com/connect/caramba.php', { form: userForm })
    .on('response', function (response) {
      // We should be signed in.
      // The site redirects back to login.php before redirecting to the dashboard
      // so there is no obvious way to figure out if the log in was successful.

      // Then we need to get the sessions page and parse out the userId.
      request.get('https://www.empatica.com/connect/sessions.php', function (error, response, body) {
        var userIdRegex = /var userId = ([0-9]+);/
        var userId = body.match(userIdRegex)[1];

        // Next we can get the list of sessions for the last 15 minutes.
        var startTime = moment().subtract(12, 'hours').format('X'); // 12 hours for now for testing
        var endTime = moment().format('X');
        var requestUrl = 'https://www.empatica.com/connect/connect.php/users/'+userId+'/sessions?from='+startTime+'&to='+endTime;
        request.get(requestUrl, function (error, response, body) {
          var processedSessions = empaticaUtils.processSessions(JSON.parse(body), bandId);
          success(processedSessions);
        });
      })
      .on('error', function (response) {
        error('There was a problem receiving the sessions.');
      });
    })

    .on('error', function (response) {
      error('There was a problem logging in.');
    });
  }
};

module.exports = empaticaConnect;
