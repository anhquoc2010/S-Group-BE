import { Router } from 'express'
const vote = Router()
import { db } from '../database/knex.js'
import { verifyToken } from '../helpers/hash.js'

export { vote }

//create vote
vote.post('/ceate-vote', verifyToken, (req, res) => {
    //title, des, ops
    const title = req.body.title;
    const description = req.body.description;
    const options = req.body.options;
    //userid from token
    const userId = req.decoded.id;
    //log all
    console.log(title, description, options, userId);
    //create poll
    db('polls').insert({
        title: title,
        description: description,
        createdAt: new Date(),
        createdBy: userId
    }).then((pollId) => {
        //create options
        const ops = options.map((op) => {
            return {
                name: op,
                pollId: pollId[0]
            }
        })
        db('options').insert(ops).then(() => {
            res.json({
                success: true,
                message: 'Success create poll'
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
});

//APIs update Poll (bao gồm update Poll, add, edit, remove Options)
vote.put('/update-vote/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const options = req.body.options;
    const userId = req.decoded.id;

    //check poll id exist
    db('polls').where('id', id).then((rows) => {
        if (rows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id not exist'
            })
        }
        //check user id
        if (rows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            })
        }
        //update poll
        db('polls').where('id', id).update({
            title: title,
            description: description
        }).then(() => {
            //delete options
            db('options').where('pollId', id).del().then(() => {
                //create options
                const ops = options.map((op) => {
                    return {
                        name: op,
                        pollId: id
                    }
                })
                db('options').insert(ops).then(() => {
                    res.json({
                        success: true,
                        message: 'Success update poll'
                    })
                }).catch((err) => {
                    res.json({
                        success: false,
                        message: err
                    })
                })
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                })
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
});

//API view Poll details. (Keyword: Nested Array)
vote.get('/view-vote/:id', (req, res) => {
    const id = req.params.id;
    //get poll
    db('polls').where('id', id).then((rows) => {
        if (rows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id not exist'
            })
        }
        const poll = rows[0];
        //get options
        db('options').where('pollId', id).then((rows) => {
            poll.options = rows;
            res.json({
                success: true,
                poll: poll
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
});

//delete vote
vote.delete('/delete-vote/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const userId = req.decoded.id;

    //check poll id exist
    db('polls').where('id', id).then((rows) => {
        if (rows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id not exist'
            })
        }
        //check user id
        if (rows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            })
        }
        //delete poll
        db('polls').where('id', id).del().then(() => {
            //delete options
            db('options').where('pollId', id).del().then(() => {
                res.json({
                    success: true,
                    message: 'Success delete poll'
                })
            }).catch((err) => {
                res.json({
                    success: false,
                    message: err
                })
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
});

// API submit and unsubmit options.
vote.put('/submit-vote/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const userId = req.decoded.id;

    //check poll id exist
    db('polls').where('id', id).then((rows) => {
        if (rows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id not exist'
            })
        }
        //check user id
        if (rows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            })
        }
        //update poll
        db('polls').where('id', id).update({
            status: 1
        }).then(() => {
            res.json({
                success: true,
                message: 'Success submit poll'
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
});

vote.put('/unsubmit-vote/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const userId = req.decoded.id;

    //check poll id exist
    db('polls').where('id', id).then((rows) => {
        if (rows.length === 0) {
            return res.json({
                success: false,
                message: 'Poll id not exist'
            })
        }
        //check user id
        if (rows[0].createdBy !== userId) {
            return res.json({
                success: false,
                message: 'You are not authorized'
            })
        }
        //update poll
        db('polls').where('id', id).update({
            status: 0
        }).then(() => {
            res.json({
                success: true,
                message: 'Success unsubmit poll'
            })
        }).catch((err) => {
            res.json({
                success: false,
                message: err
            })
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err
        })
    })
});
