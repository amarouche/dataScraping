require('dotenv').config()
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port:process.env.PORT,
  }
);

try {
  sequelize.authenticate();
  console.log('Connecté à la base de données MySQL!');
} catch (error) {
  console.error('Impossible de se connecter, erreur suivante :', error);
}
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.airlines = require("./models/airline.model.js")(sequelize, Sequelize);
module.exports = db

