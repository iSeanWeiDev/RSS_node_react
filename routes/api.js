var express = require('express');
var router = express.Router();
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
]);

const got = require('got');
let Parser = require('rss-parser');
let parser = new Parser();

const { getMetadata } = require('page-metadata-parser');
const domino = require('domino');
const fetch = require("node-fetch");
const FeedModel = require('../models').Feed; 
const DataModel = require('../models').Data;

/* GET api listing. */
router.post('/feeds', (req, res) => {
  FeedModel.findOne({
    where: {
      name: req.body.name,
    }
  }).then(async feedData => {
    if (feedData.get().version == 'v1') {
      const reqUrl = feedData.get().url;
      try {
        let feed = await parser.parseURL(reqUrl);
    
        const metaDataList1 = feed.items.map(async (item) => {
          const { body: html, url } = await got(item.link)
          const tmpdata = await metascraper({ html, url })
          const metadata = {
            'description': tmpdata.description,
            'logo': tmpdata.logo,
            'image': tmpdata.image,
            'publisher': tmpdata.publisher,
            'date': item.isoDate,
            'title': tmpdata.title,
            'url': tmpdata.url
          };
          return metadata;
        })
    
        await Promise.all([...metaDataList1])
          .then(metaDataList => {
            res.send({
              data: metaDataList,
              status: 'success',
              url: reqUrl
            })
          })
          .catch(error => {
            console.log(error);
          })
      } catch (error) {
        console.log(error);
        res.send({
          status: 'failed',
          data: error,
          url: reqUrl
        })
      }
    } else {
      const reqUrl = feedData.get().url;

      try {
        parser.parseURL(reqUrl, async function (err, feed) {
          if (err) {
            console.log("err", err)
          }
          const metaDataList1 = feed.items.map(async (item) => {
    
            const response = await fetch(item.link);
            const html = await response.text();
            const doc = domino.createWindow(html).document;
            const tmpdata = getMetadata(doc, item.link);
    
            const metadata = {
              'description': tmpdata.description,
              'logo': tmpdata.icon,
              'image': tmpdata.image,
              'publisher': tmpdata.provider,
              'date': item.isoDate,
              'title': tmpdata.title,
              'url': tmpdata.url
            }
            return metadata;
          })
    
          await Promise.all([...metaDataList1])
            .then(metaDataList => {
              res.send({
                data: metaDataList,
                status: 'success',
                url: reqUrl
              })
            })
            .catch(error => {
              console.log(error);
            })
        });
      } catch (error) {
        res.send({
          status: 'failed',
          data: error,
          url: reqUrl
        })
      }
    }
  });
});

router.post('/feeds/all.rss', (req, res) => {
  DataModel.findAll({
    order: [
      ['id', 'DESC'],
    ],
    limit: 100
  })
    .then(result => {
      var sendData = [];
      for (var obj of result) {
        sendData.push(obj.get());
      }

      res.send({
        status: 'success',
        data: sendData,
      })
    });
});


module.exports = router;
