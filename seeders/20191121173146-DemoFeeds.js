'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('Feeds', [
      {
        name: 'merryjane',
        description: ``,
        url: `https://merryjane.com/feed/all.rss`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'hightimes',
        description: ``,
        url: `https://hightimes.com/news/feed/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'cannalaw',
        description: ``,
        url: `https://www.cannalawblog.com/feed/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'leafly',
        description: ``,
        url: `https://www.leafly.com/feed/`,
        version: 'v2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'cannabist2',
        description: ``,
        url: `https://www.thecannabist.co/feed/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'marijuanadaily',
        description: ``,
        url: `https://mjbizdaily.com/feed/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'freshtoast',
        description: ``,
        url: `https://thefreshtoast.com/feed/`,
        version: 'v2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'medicalmarijuana',
        description: ``,
        url: `https://www.medicalmarijuanainc.com/feed/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'grizzle',
        description: ``,
        url: `https://grizzle.com/marijuana/feed/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'cannabisnet',
        description: ``,
        url: `https://cannabis.net/rss/blog/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'marijuana',
        description: ``,
        url: `https://www.marijuana.com/feed/`,
        version: 'v1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});


  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
