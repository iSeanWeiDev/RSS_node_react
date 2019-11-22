require('dotenv').config();

var mysql = require('mysql2');
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

var FeedModel = require('../models').Feed;
var DataModel = require('../models').Data;

process.on('message', msg => {
  var newData = [];
  var oldData = [];

  setInterval(() => {
    var feedPromise = new Promise((resolve, reject) => {
      var feedList = [];
      FeedModel.findAll()
        .then(feeds => {
          for (var obj of feeds) {
            feedList.push(obj.get());
          }
  
          resolve(feedList);
        })
        .catch(error => {
          console.log(error);
        });
    });
  
    feedPromise.then(feedList => {
      var lengthFeedList = feedList.length;
      async function getFeedData() {
        lengthFeedList --;

        var dataFeedPromise = new Promise(async (resolve, reject) => {
          if (feedList[lengthFeedList].version == "v1") {
            var reqUrl = feedList[lengthFeedList].url;
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
                resolve(metaDataList);
              })
              .catch(error => {
                reject(error);
              });
          } else {
            var url = feedList[lengthFeedList].url;
            parser.parseURL(url, async function (err, feed) {
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
                  resolve(metaDataList);
                })
                .catch(error => {
                  reject(error);
                });
            });
          }
        });
  
        dataFeedPromise.then(result => {
          for (var obj of result) {
            newData.push(obj);
          }
        });
  
        if (lengthFeedList > 0) {
          getFeedData();
        }
      }
  
      getFeedData();
  
      setTimeout(() => {
        function comparer(otherArray){
          return function(current){
            return otherArray.filter(function(other){
              return other.description == current.description && other.image == current.image
            }).length == 0;
          }
        }

        var onlyInNew = newData.filter(comparer(oldData));
        var onlyInOld = oldData.filter(comparer(newData));
        
        var resultData = onlyInNew.concat(onlyInOld);

        DataModel.bulkCreate(resultData)
          .then(createdData => {
            if (createdData.length > 0) {
              var query = `SELECT id, count(*) AS counter FROM data GROUP BY description, image HAVING counter > 1`;
              var opt = {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: 3306,
                database: process.env.DB_DBNAME,
              }

              var dbConn = mysql.createConnection(opt);

              dbConn.query(query, (err,rows) => {
                if (err) throw err;

                var deleteRowList = [];
                for(var obj of rows) {
                  deleteRowList.push(obj.id);
                }
                
                DataModel.destroy({
                  where: {
                    id: deleteRowList,
                  }
                }).then(() => {
                  console.log(`Auto process ${createdData.length} feed data updated!`)
                });
                deleteRowList = [];
              })
            }
          });

        oldData = [];
        oldData = newData;
        newData = [];
      }, 20000);
    });
  }, process.env.FEED_REFRESH_TIME);

  process.send(true);
});
