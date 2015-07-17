# empatica-connect [![Build Status](https://travis-ci.org/danbee/empatica-connect.svg?branch=master)](https://travis-ci.org/danbee/empatica-connect)

A node module for fetching data from Empatica Connect.


## Install

```
$ npm install --save empatica-connect
```


## Usage

The username and password for the account should be set up as environment
variables:

```sh
$ export EMPATICA_USERNAME={username}
$ export EMPATICA_PASSWORD={password}
```

`direnv` is a good tool to do this in development.

```js
var empaticaConnect = require('empatica-connect');

empaticaConnect.getLastSession(deviceId, function (session) {
  // do something with the session data
},
function (error) {
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
