const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')
const api = supertest(app)


const initialNotes = [
    {
        content: 'Aprendiendo con midudev',
        important: true,
        date: new Date()
    },
    {
        content: 'Sigueme en mi web',
        important: true,
        date: new Date()
    },
    {
        content: 'Gracias por la ayuda',
        important: true,
        date: new Date()
    }
]

const getAllContentsFromNotes = async () => {
    const response = await api.get('/api/notes')
    return {
        contents: response.body.map(note => note.content),
        response
    }
}

const getUsers = async () => {
    const usersDb = await User.find({})
    return usersDb.map(user => user.toJSON())
}

module.exports = {
    initialNotes,
    api,
    getAllContentsFromNotes,
    getUsers
}