const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');

const Ultrasonic = sequelize.define('Ultrasonic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    distance_cm: {
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
    tableName: 'ultrasonic',
    timestamps: false
});

module.exports = Ultrasonic;