import fs from "fs";
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CA)
      }
    },
    logging: false
  }
);

module.exports = { sequelize };
