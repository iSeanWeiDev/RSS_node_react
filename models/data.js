'use strict';
module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define('Data', {
    description: DataTypes.TEXT,
    logo: DataTypes.TEXT,
    image: DataTypes.TEXT,
    publisher: DataTypes.STRING,
    date: DataTypes.DATE,
    title: DataTypes.TEXT,
    url: DataTypes.TEXT
  }, {});
  Data.associate = function(models) {
    // associations can be defined here
  };
  return Data;
};