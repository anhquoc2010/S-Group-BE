import { Router } from 'express';
const user_router = Router();
export { user_router };

const users = [
    {
        "id": 1,
        "fullname": "Nguyen Huy Tuong",
        "gender": true,
        "age": 18
    },
    {
        "id": 2,
        "fullname": "Nguyen Thi Tuong",
        "gender": false,
        "age": 15
    }
]

user_router.get('/', (req, res) => {
    res.status(200).json(users)
})

user_router.get('/:id', (req, res) => {
    const user = users.find(user => user.id == req.params.id)

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ message: 'User not found' })
    }
})

user_router.put('/:id', (req, res) => {
    const user = users.find(user => user.id == req.params.id)
    user.fullname = req.body.fullname
    user.gender = req.body.gender
    user.age = req.body.age
    res.status(204).end()
})

user_router.post('/', (req, res) => {
    const user = {
        id: users.length + 1,
        fullname: req.body.fullname,
        gender: req.body.gender,
        age: req.body.age
    }
    users.push(user)
    res.status(201).json(user)
})

user_router.delete('/:id', (req, res) => {
    const user = users.find(user => user.id == req.params.id)
    const index = users.indexOf(user)
    users.splice(index, 1)
    res.status(204).end()
})
