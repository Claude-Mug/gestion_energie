const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');

const Dht11 = sequelize.define('Dht11', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    humidite: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    etat: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    datetime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'dht11',
    timestamps: false
});

module.exports = Dht11;