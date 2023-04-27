import { Router } from 'express'
const user_router = Router()
import { validateRequest } from '../middleware/validateRequest.js'
import { db } from '../database/connection.js'
import { hashPassword, verifyToken } from '../helpers/hash.js'

export { user_router }

user_router.get('/', (req, res) => {
    db.query('SELECT * FROM user', (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

user_router.get('/:id', (req, res) => {
    db.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

//update user check token
user_router.put('/:id', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = verifyToken(token)
    if (decoded.id === parseInt(req.params.id)) {
        const {
            hashedPassword,
            salt,
        } = hashPassword(req.body.password)

        req.body.password = hashedPassword
        req.body.salt = salt
            
        db.query('UPDATE users SET ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).json(rows)
            }
        })
    } else {
        res.status(403).json({
            message: 'You are not allowed to update this user'
        })
    }
})

user_router.post('/', validateRequest, (req, res) => {
    db.query('INSERT INTO user SET ?', req.body, (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            res.status(201).json(rows)
        }
    })
})

user_router.delete('/:id', (req, res) => {
    db.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).json(rows)
        }
    })
})
