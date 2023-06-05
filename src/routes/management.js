import { Router } from 'express'
const management = Router()
//knex
import { db } from '../database/knex.js'
import { verifyToken } from '../helpers/hash.js'
import { createAuditColumns } from '../middleware/auth.js'

export { management }

management.get('/users', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }

    db.select('*').from('users').then((rows) => {
        res.status(200).json(rows);
    });
});

management.post('/users', verifyToken, createAuditColumns, (req, res) => {
    db('users').insert(req.body).then((rows) => {
        res.status(201).json(rows);
    });
});

management.put('/users/:id', verifyToken, createAuditColumns, (req, res) => {
    db('users').where('id', req.params.id).update(req.body).then((rows) => {
        res.status(200).json(rows);
    });
});

management.delete('/users/:id', verifyToken, (req, res) => {
    db('users').where('id', req.params.id).del().then((rows) => {
        res.status(200).json(rows);
    });
});

//get users pagination
management.get('/users/pagination', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }
    const page = req.query.page;
    const limit = req.query.limit;
    const offset = (page - 1) * limit;
    db.select('*').from('users').limit(limit).offset(offset).then((rows) => {
        res.status(200).json(rows);
    });
});

//search users by username, name, email
management.get('/users/search', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }
    const keyword = req.query.keyword;
    db.select('*').from('users').where('username', 'like', `%${keyword}%`).orWhere('name', 'like', `%${keyword}%`).orWhere('email', 'like', `%${keyword}%`).then((rows) => {
        res.status(200).json(rows);
    });
});
