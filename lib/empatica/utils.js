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
  }
}

module.exports = empaticaUtils;
