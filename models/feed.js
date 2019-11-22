'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feed = sequelize.define('Feed', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING,
    version: DataTypes.STRING,
  }, {});
  Feed.associate = function(models) {
    // associations can be defined here
  };
  return Feed;
};