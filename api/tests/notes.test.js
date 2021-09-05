const mongoose = require('mongoose')
const { initialNotes,api, getAllContentsFromNotes } = require('../utils/helpers')
const Note = require('../models/Note')

beforeEach(async () => {
  await Note.deleteMany({})
  
  //paralelo
  // const noteObjects = initialNotes.map(note => new Note(note))
  // const promises = noteObjects.map(note => note.save())
  // await Promise.all(promises)

  //secuencial
  for (let note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

test('Las notas se devuelven en json', async () => {
  console.log('First test!!')
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const { response } = await getAllContentsFromNotes()
  expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const { contents } = await getAllContentsFromNotes()
  
  expect(contents).toContain(
    'Aprendiendo con midudev'
  )
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Proximamente async/await',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const { contents,response } = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const { response } = await getAllContentsFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

describe('delete notes', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentsFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]
  
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)
  
      const { contents, response: secondResponse } = await getAllContentsFromNotes()
      expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
      expect(contents).not.toContain(noteToDelete.content)
  
  })
  
  // test('a note that dont exists cant be deleted', async () => {
  //   await api
  //     .delete(`/api/notes/1234`)
  //     .expect(400)
  
  //     const { response } = await getAllContentsFromNotes()
  //     expect(response.body).toHaveLength(initialNotes.length)
  
  // })
})

afterAll(() => {
  mongoose.connection.close()
})