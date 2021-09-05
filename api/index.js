require('dotenv').config()
require('./mongoDb')

const cors = require('cors')
const { response } = require('express')
const express = require('express')
const Note = require('./models/Note.js')
const app = express()
const usersRouter  = require('./controllers/users')
const loginRouter = require('./controllers/login')
const userExtractor = require('./middleware/userExtractor')
const User = require('./models/User')
const { JsonWebTokenError } = require('jsonwebtoken')

app.use(cors())
app.use(express.json())
app.use(express.static('../app/build'))
app.get('/api/notes', async (request, response) => {
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1
    })
    response.json(notes)

    // Note.find({}).then(notes => {
    //     response.json(notes)
    // })
})

app.get('/api/notes/:id', (request, response, next) => {
    const { id } = request.params
    
    Note.findById(id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch (err => {
        next(err)
        
    })
})
app.put('/api/notes/:id',userExtractor, (request, response, next) => {
    const { id }= request.params
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    Note.findByIdAndUpdate(id,newNoteInfo, {new : true}).then(result => {
        response.json(result)
    }).catch(err => err.next())
})

app.delete('/api/notes/:id', userExtractor, async (request, response, next) => {
    const { id }= request.params

    await Note.findByIdAndDelete(id)
    response.status(204).end()

})

app.post('/api/notes', userExtractor, async (request, response, next) => {
    const { content, important } = request.body
    const { userId } = request
    const user = await User.findById(userId)

    if (!content) {
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = new Note({
        content: content,
        important: important || false,
        date: new Date().toDateString(),
        user: user._id
    })

    
    try {
        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()
        response.json(savedNote)
    } catch (error) {
        next(error)
    }
    
    
    // newNote.save().then(savedNote => {
    //     response.json(savedNote)
    // }).catch(err => next(err))
    // //notes = [...notes, newNotes]
    //response.status(201).json(newNotes)
})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
  }

app.use((request, response, next) => {
    response.status(404).end()
})

app.use((err, request, response, next) => {

    // const ERROR_HANDLERS = {
    //     CastError: response => response.status(400).send({err: 'id used is malformed'}),
    //     ValidationError: (response,err) => response.status(409).send({
    //         error: err.message
    //     }),
    //     JsonWebTokenError: (response,err) => response.status(401).json({
    //         error: "token invalid or missing"
    //     }),
    //     defaultError: response => response.status(500).end()
    // }
    console.error(err);

    if (err.name === 'CastError') {
        response.status(400).send({err: 'id used is malformed'})

    }else if (err.name === 'ValidationError'){
        response.status(409).send({
            error: err.message
        })

    } else if (err.name === 'JsonWebTokenError'){
        response.status(401).json({
            error: "token invalid or missing"
        })

    } else if (err.name === 'TokenExpiresError'){
        response.status(401).json({
            error: "token expired"
        })

    } else {
        response.status(500).end()
    }
    
})


const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }