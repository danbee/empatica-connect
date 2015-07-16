# empatica-connect [![Build Status](https://travis-ci.org/danbee/empatica-connect.svg?branch=master)](https://travis-ci.org/danbee/empatica-connect)

A node module for fetching data from Empatica Connect.


## Install

```
$ npm install --save empatica-connect
```


## Usage

```js
var empaticaConnect = require('empatica-connect');

empaticaConnect.getLastSession(deviceId, function (data) {
  // do something with the data
},
function (data) {
  // something went wrong!
});
```

## API

### empaticaConnect.getLastSession(deviceId, success, failure)

#### deviceId

*Required*
Type: `string`

Example: "A00182-E4"


## License

MIT © [Dan Barber](http://danbarber.me)
