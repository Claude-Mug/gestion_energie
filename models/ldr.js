const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');

const Ldr = sequelize.define('Ldr', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    luminosite_niveau: {
        type: DataTypes.INTEGER,
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
    tableName: 'ldr',
    timestamps: false
});

module.exports = Ldr;