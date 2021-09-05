import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import {  prettyDOM } from '@testing-library/dom'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'This is a test',
    important: true
  }

  const component = render(<Note note={
      note
    }
                           />
  )

  component.getByText('This is a test')
  // // expect(component.container).toHaveTextContent('camiones')

  // const li = component.container.querySelector('li')

  // console.log(prettyDOM(li))
})

test('clicking the button calls event handler once', () => {
  const note = {
    content: 'This is a test',
    important: true
  }

  const mockHandle = jest.fn()
  const component = render(<Note
    note={note}
    toggleImportance={mockHandle}
                           />
  )

  const button = component.getByText('make not important')
  fireEvent.click(button)

  expect(mockHandle).toHaveBeenCalledTimes(1)
})
