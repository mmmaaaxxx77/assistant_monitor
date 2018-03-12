/**********************
 * import lib
 ***********************/
//https://drive.google.com/open?id=0B7c4nRHGR8X6a0lXZ08wYzhheUk
//https://drive.google.com/file/d/0B7c4nRHGR8X6a0lXZ08wYzhheUk/view?usp=sharing

// npm i google-refresh-token
var refresh = require('./google-token-refresh');
var fs = require('fs');
var path = require('path');
var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var http = require('http');
var spawn = require('child_process').spawn;
var url = require('url');
var querystring = require('querystring');
var secrets = require('./client_secret_690463749645-ovvi1gbpu2io23fel5pvhh4e0vldm0n3.apps.googleusercontent.com.json');

/**********************
 * setting
 ***********************/
var called = false;
var TOKEN_DIR = path.join(__dirname, '.credentials/');
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

function callOnce(callback) {
  if (!called) {
    called = true;
    callback();
  }
}

function handler(request, response, server, callback) {
  var self = this;
  var qs = querystring.parse(url.parse(request.url).query);
  self.oAuth2Client.getToken(qs.code, function(err, tokens) {
    if (err) {
      console.error('Error getting oAuth tokens: ' + err);
    }
    console.log(tokens);
    self.oAuth2Client.setCredentials(tokens);
    self.isAuthenticated = true;
    response.end('Authentication successful! Please return to the console.');
    callback(tokens);
    server.close();

    storeToken(tokens);
  });
}

/**********************
 * refresh token when call execute
 ***********************/
function refreshToken() {

  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      self._authenticate(scopes, callback);
    } else {
      var jsonS = JSON.parse(token);
      refresh(jsonS.refresh_token, secrets.installed.client_id, secrets.installed.client_secret,
        function(err, json, res) {
          if (err) return handleError(err);
          if (json.error) return handleError(new Error(res.statusCode + ': ' + json.error));

          var newAccessToken = json;
          if (!newAccessToken) {
            return handleError(new Error(res.statusCode + ': refreshToken error'));
          }
          console.log(newAccessToken);
          var expireAt = new Date(+new Date + parseInt(json.expiresIn, 10));

          jsonS.access_token = json.accessToken
          jsonS.expiry_date = json.expiresAt
          storeToken(jsonS);
        });
    }
  });

}

/**********************
 * client object
 ***********************/
function SampleClient(options) {
  var self = this;
  self.isAuthenticated = false;
  this._options = options || {
    scopes: []
  };

  // create an oAuth client to authorize the API call
  this.oAuth2Client = new OAuth2Client(
    secrets.installed.client_id,
    secrets.installed.client_secret,
    secrets.installed.redirect_uris[1]
  );

  this._authenticate = function(scopes, callback) {
    // grab the url that will be used for authorization
    self.authorizeUrl = self.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' ')
    });
    var server = http.createServer(function(request, response) {
      callOnce(function() {
        handler.call(self, request, response, server, callback);
      });
    }).listen(8080, function() {
      spawn('open', [self.authorizeUrl]);
    });
  };

  self.execute = function(scopes, callback) {
    self._callback = callback;
    if (self.isAuthenticated) {
      callback.apply();
    } else {
      fs.readFile(TOKEN_PATH, function(err, token) {

        if (err) {
          self._authenticate(scopes, callback);
        } else {
          refreshToken();
          self.oAuth2Client.setCredentials(JSON.parse(token));
          self.isAuthenticated = true;
          callback(token);
        }
      });

    }
  };

  self.refreshToken = refreshToken;

  return self;
}

/**********************
 * save token
 ***********************/
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

module.exports = new SampleClient();