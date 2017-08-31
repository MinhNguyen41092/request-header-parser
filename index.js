"use strict"

const express = require('express');
const path = require('path');
const ua = require('ua-parser');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

app.route('/api/whoami').get((req, res) => {
  // parse User-Agent field in HTTP request
  const user_agent = req.get('User-Agent');
  const info = ua.parse(user_agent);
  // get OS in string in user-agent object
  // https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
  const regExp = /\(([^)]+)\)/;
  const os = regExp.exec(info.string)[0];
  // get language in Accept-Language field in HTTP request
  const language = req.get('Accept-Language').split(",")[0];
  // get ip address
  let ip = req.ip;
  if(ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7);
  }
  var result = {
    "ipAddress": ip,
    "language": language,
    // remove ()
    "software": os.slice(1, os.length - 1)
  };
  res.send(result);
});
app.listen(process.env.PORT || 3000);
