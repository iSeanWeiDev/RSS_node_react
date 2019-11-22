const RSS = require('rss');
const express = require('express');

const router = express.Router();

const DataModel = require('../models').Data;

router.get('/feeds/all.rss', (req, res) => {
  DataModel.findAll({
    order: [
      ['id', 'DESC'],
    ],
    limit: 100
  })
    .then(result => {
      var feed = new RSS();

      for (var obj of result) {
        feed.item(obj.get());
      }
      
      res.send(feed.xml());
    });
});

module.exports = router;
