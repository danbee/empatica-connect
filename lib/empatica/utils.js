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

module.exports = empaticaUtils;
