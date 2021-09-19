const sequelize = require("./../db.config.js");


module.exports = (sequelize, Sequelize) => {
  const Airlines = sequelize.define("airlines", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    airline_code: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    iata_code: {
      type: Sequelize.STRING
    },
    oaci_code: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    website: {
      type: Sequelize.STRING
    },
    remarks: {
      type: Sequelize.STRING
    }
  });
  return Airlines;
};