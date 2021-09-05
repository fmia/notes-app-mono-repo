import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Togglable buttonLabel='show'>
        <div className='testDiv'>testDivContent</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    component.getByText('testDivContent')
  })

  test('at start the children are not displayed', () => {
    const el = component.getByText('testDivContent')
    expect(el.parentNode).toHaveStyle('display:none')
  })

  test('after clicking children are displayed', () => {
    const button = component.getByText('show')
    fireEvent.click(button)

    const el = component.getByText('testDivContent')
    expect(el.parentNode).not.toHaveStyle('display: none')
  })
})
