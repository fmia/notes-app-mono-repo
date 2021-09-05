import React, { useRef, useState } from 'react'
import Togglable from './Togglable'

export default function NoteForm ({ addNote, handleLogout }) {
  const [newNote, setNewNote] = useState('')
  const elementRef = useRef()
  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: false
    }
    addNote(noteObject)
    setNewNote('')
    elementRef.current.toggleVisibility()
  }

  console.log(elementRef)
  return (
    <Togglable buttonLabel='New note' ref={elementRef}>
      <h2>Create a new Note</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text' placeholder='Write your note content' value={newNote}
          onChange={handleChange}
        />
        <button>Create note</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </form>
    </Togglable>
  )
}
