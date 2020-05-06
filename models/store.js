
//defining stores schema

module.exports = function (sequelize, DataTypes) {
    var Store = sequelize.define('Store', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        store_name: {
            type: DataTypes.STRING
        },
        store_address: {
            type: DataTypes.STRING
        },
        uniqueID: {
            type: DataTypes.STRING,
            unique: true
        },
        availability: {
            type: DataTypes.INTEGER
        },
        longlat: {
            type: DataTypes.STRING
        }
    
    });
    return Store;
    }