const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,        // defaultdb
    process.env.DB_USER,        // avnadmin
    process.env.DB_PASSWORD,    // mot de passe Aiven
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(process.env.DB_SSL_CA),   // ./ca.pem
            }
        }
    }
);

module.exports = sequelize;
