
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fork = require('child_process').fork;

const apiRouter = require('./routes/api');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', apiRouter);

// Set up the Process to get the data from rss feeds
var getFeedDataProcess = fork(path.join(__dirname, "./controllers/getData.js"));
getFeedDataProcess.on('message', data => {
  if (data == true) {
    console.log('Getting feed had been started!');
  } else {
    console.log('Getting feed error!');
  }
});
getFeedDataProcess.send({data: 1});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
