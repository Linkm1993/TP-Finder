
//defining posts schema

module.exports = function (sequelize, Sequelize) {
    var Post = sequelize.define('Post', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        store_id: {
            type: Sequelize.STRING
        },
        author: {
            type: Sequelize.STRING
        },
        msg: {
            type: Sequelize.STRING
        }
    
    });
    return Post;
    }

    /*
    CREATE TABLE posts (
    id INT AUTO_INCREMENT NOT NULL,
    store_id VARCHAR(30),
    author VARCHAR(30),
    msg VARCHAR(55),
    PRIMARY KEY(id)
     */