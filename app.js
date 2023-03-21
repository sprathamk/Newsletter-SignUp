const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
  const fName = req.body.fname;
  const lName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us21.api.mailchimp.com/3.0/lists/7333ef5360';

  const options = {
    method: 'POST',
    auth: 'sprathamk:bee4bd0961163ed2f57690835b8386a9-us21',
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200 || response.errors) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }

    console.log(response.statusCode);
    console.log(response.errors);

    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);

  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.listen('3000', function () {
  console.log('Server is running at port 3000');
});

//API key
//bee4bd0961163ed2f57690835b8386a9-us21

//Audience id
//7333ef5360
