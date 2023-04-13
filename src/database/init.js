import { db } from './connection.js'

const creatSql = `CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    gender BOOLEAN,
    age INT UNSIGNED,
    PRIMARY KEY (id)
)`

const seedSql = `INSERT INTO user(fullname, gender, age)
    VALUES ('Nguyen Huy Tuong', true, 18),
    ('Nguyen Thi Tuong', false, 15)`

db.query(creatSql, (err) => {
    if (err) {
        console.log(err)
        return
    }

    db.query(seedSql, (seedErr) => {
        if (seedErr) {
            console.log(seedErr)
            return
        }

        console.log('Success init database...')
    })
})