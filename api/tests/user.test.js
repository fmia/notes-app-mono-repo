const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/user')
const { api, getUsers } = require('../utils/helpers')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    
    const user = new User({
        username: 'root',
        passwordHash
    })

    await user.save()
})

test('work as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
        username: 'fmia',
        name: 'francisco',
        passwordHash: 'pwd'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
})

test('fails if username is already taken', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
        username: 'fmia',
        name: 'francisco',
        passwordHash: 'pwd'
    }

   const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(result.body.errors.username.message).toContain('username to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

afterAll( () => {
   mongoose.connection.close()
   server.close()
})