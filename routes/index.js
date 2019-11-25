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
      var feed = new RSS({
        title: 'Weed Feed',
        descriptopn: 'Every day weed feed for users.(dev)',
        feed_url: 'http://weekfeed.biz:5000/feeds/all.rss.xml',
        image_url: 'http://weedfeed.biz/logos/top-logo.png',
        site_url: 'http://weekfeed.biz',
        language: 'en',
        ttl: '60',
      });

      for (var obj of result) {
        feed.item({
          title: obj.get().title,
          description: obj.get().description,
          url: obj.get().url,
          author: obj.get().publisher,
          date: obj.get().date,
          enclosure: {
            url: obj.get().image,
            size: 680,
            type: 'image/jpeg'
          }
        });
      }
      res.send(feed.xml());
    });
});

module.exports = router;
