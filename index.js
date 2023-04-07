import express, { json, urlencoded } from 'express'

const app = express()

app.use(json())

app.use(urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('Server is running...')
})

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

app.get('/user', (req, res) => {
    res.status(200).json(users)
})

app.get('/user/:id', (req, res) => {
    const user = users.find(user => user.id == req.params.id)

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ message: 'User not found' })
    }
})

app.put('/user/:id', (req, res) => {
    const user = users.find(user => user.id == req.params.id)
    user.fullname = req.body.fullname
    user.gender = req.body.gender
    user.age = req.body.age
    res.status(204).end()
})

app.post('/user', (req, res) => {
    const user = {
        id: users.length + 1,
        fullname: req.body.fullname,
        gender: req.body.gender,
        age: req.body.age
    }
    users.push(user)
    res.status(201).json(user)
})

app.delete('/user/:id', (req, res) => {
    const user = users.find(user => user.id == req.params.id)
    const index = users.indexOf(user)
    users.splice(index, 1)
    res.status(204).end()
})