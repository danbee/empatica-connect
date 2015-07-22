'use strict';

var async = require('async');
var request = require('request');
var moment = require('moment');

var request = request.defaults({ jar: true });

var userForm = { username: process.env.EMPATICA_USERNAME,
                 password: process.env.EMPATICA_PASSWORD };

var empaticaUtils = {
  getDeviceName: function(deviceId, deviceModel, deviceLabel, hardwareCode) {
    var deviceName = "no name";

    if (deviceLabel != null) {

      if (deviceModel.indexOf("E4") > -1) {
        var pad = "00000";
        var n = parseInt(deviceLabel).toString(16);
        var result = "A" + (pad + n).slice(-pad.length);

        deviceName = result.toUpperCase() + "-" + deviceModel;
      } else {
        deviceName = deviceLabel.substring(5, 10) + "-" + deviceModel;
      }
    } else if (deviceId != null) {
      deviceName = deviceId  + "-" + deviceModel;
    } else if (hardwareCode != null) {
      deviceName = "hw: " + hardwareCode;
    }

    return deviceName;
  },

  processSessions: function(sessionData, deviceName) {
    var deviceRegex = new RegExp('^'+deviceName);
    return sessionData.map(function (session) {
      session.device_name = this.getDeviceName(session.device_id, session.device, session.label);
      return session;
    }.bind(this))
    .filter(function (session) {
      return session.device_name.match(deviceRegex);
    });
  },

  processEDA: function(data) {
    var lines = data.split('\n');
    return lines.map(function (line) {
      return parseInt(line, 36) / 10000;
    });
  },

  processBVP: function(data) {
    var lines = data.split('\n');
    return lines.map(function (line) {
      return -parseInt(line, 36) / 10;
    });
  },

  processACC: function(data) {
    var lines = data.split('\n');
    return lines.map(function (line) {
      return parseInt(line, 36)/100;
    });
  },

  processIBI: function(data) {
    var lines = data.split('\n');
    var startingTimestamp = 0;
    var processedData = [];

    lines.forEach(function(line, lineNo) {
      if (lineNo < lines.length - 3){
        var values = line.split(',');
        if (lineNo == 0){
          if (parseFloat(values[0]) < 60*60*24*10) {
            startingTimestamp=(parseFloat(values[0]) + correctTimestamp);
            //console.log(startingTimestamp);
          }
          else {
            startingTimestamp = parseFloat(values[0]) * 1000;
          }
        }else{
          processedData.push([startingTimestamp + parseFloat(values[0]) * 1000, 60 / parseFloat(values[1])]);
        }
      }
    });

    return processedData;
  },

  processTEMP: function(data) {
    var lines = data.split('\n');
    return lines.map(function (line) {
      return parseInt(line,36)/1000;
    });
  }
}

var empaticaConnect = {
  getLastSession: function (bandId, success, failure) {
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

        // Next we can get the list of sessions for the last 24 hours.
        var startTime = moment().subtract(24, 'hours').format('X');
        var endTime = moment().format('X');
        var requestUrl = 'https://www.empatica.com/connect/connect.php/users/'+userId+'/sessions?from='+startTime+'&to='+endTime;
        request.get(requestUrl, function (error, response, body) {
          var processedSessions = empaticaUtils.processSessions(JSON.parse(body), bandId);
          var session = processedSessions.slice(-1)[0];

          if (session != undefined) {
            session.data = {};
            var dataUrl = 'https://www.empatica.com/connect/get_csv_proxy.php?id='+session.id+'&file=';
            var dataTypes = ['eda', 'bvp', 'acc', 'ibi', 'temp'];
            var dataUrls = dataTypes.map(function (type) { return dataUrl + type; });

            async.map(dataUrls, request.get, function (error, results) {
              dataTypes.forEach(function (type, index) {
                session.data[type] = empaticaUtils['process'+type.toUpperCase()](results[index].body);
              });
              success(session);
            });
          }
          else {
            failure('No sessions found.');
          }

        });
      })
      .on('error', function (response) {
        failure('There was a problem receiving the sessions.');
      });
    })

    .on('error', function (response) {
      failure('There was a problem logging in.');
    });
  }
};

module.exports = empaticaConnect;
