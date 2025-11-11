const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequerize');

const Pir = sequelize.define('Pir', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    etat_mouvement: {
        type: DataTypes.BOOLEAN,
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
    tableName: 'pir',
    timestamps: false
});

module.exports = Pir;