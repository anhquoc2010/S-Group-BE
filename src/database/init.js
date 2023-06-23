import { db } from './connection.js'

const creatSql = `CREATE TABLE users (
    id INT AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    salt VARCHAR(255),
    name VARCHAR(255),
    age INT UNSIGNED,
    gender BOOLEAN,
    email VARCHAR(255),
    passwordResetToken VARCHAR(255),
    passwordResetExpiration DATETIME,
    passwordLastResetDate DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    FOREIGN KEY (createdBy) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY (id),
    UNIQUE (username)
)`

//create table polls 1-n options 1-n options_users n-1 users
const creatSql2 = `CREATE TABLE polls (
    id INT AUTO_INCREMENT,
    title VARCHAR(255),
    description VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT,
    FOREIGN KEY (createdBy) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY (id)
)`
const creatSql3 = `CREATE TABLE options (
    id INT AUTO_INCREMENT,
    name VARCHAR(255),
    pollId INT,
    FOREIGN KEY (pollId) REFERENCES polls(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY (id)
)`

const creatSql4 = `CREATE TABLE options_users (
    id INT AUTO_INCREMENT,
    optionId INT,
    userId INT,
    FOREIGN KEY (optionId) REFERENCES options(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    PRIMARY KEY (id)
)`

db.query(creatSql4, (err) => {
    if (err) {
        console.log(err)
        return
    }

    // db.query(seedSql, (seedErr) => {
    //     if (seedErr) {
    //         console.log(seedErr)
    //         return
    //     }

    console.log('Success init database...')
    // })
})