import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog test', () => {
  let blog, user, mockHandler, component

  beforeEach(() => {
    blog = {
      title: 'dniot',
      author: 'dn',
      url: 'dniot.tk',
      likes: 0
    }
    user = {
      name: 'dn',
      username: 'dn'
    }

    mockHandler = jest.fn()

    component = render(
      <Blog blog={blog} user={user} updateBlog={mockHandler} />
    )
  })

  test('renders default blog', () => {
    const div = component.container.querySelector('.blog')

    expect(div).toHaveTextContent(
      'dniot'
    )
    expect(div).toHaveTextContent(
      'dn'
    )
    expect(div).not.toHaveTextContent(
      'dniot.tk'
    )
    expect(div).not.toHaveTextContent(
      0
    )
  })
  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglable')

    expect(div).toHaveTextContent(
      'dniot.tk'
    )
    expect(div).toHaveTextContent(
      0
    )
  })
  test('clicking the button calls event handler once', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})