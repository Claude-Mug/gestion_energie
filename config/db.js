const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Chemin absolu vers ca.pem
const sslCAPath = path.resolve(__dirname, process.env.DB_SSL_CA);

console.log("📌 Certificat SSL utilisé :", sslCAPath);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,

    // SSL obligatoire pour Aiven MySQL
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(sslCAPath)
      }
    }
  }
);

module.exports = sequelize;
