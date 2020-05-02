
//defining stores schema

module.exports = function (sequelize, Sequelize) {
    var Store = sequelize.define('Store', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        store_name: {
            type: Sequelize.STRING
        },
        uniqueID: {
            type: Sequelize.STRING
        },
        availability: {
            type: Sequelize.INTEGER
        }
    
    });
    return Store;
    }