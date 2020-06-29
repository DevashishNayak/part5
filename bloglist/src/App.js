import React, { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ className, setClassName ] = useState(null)

  const errormessage ='error'
  const notification ='notification'

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setClassName(errormessage)
      setMessage('wrong username or password')
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLogout = () => {
    window.localStorage.removeItem(
      'loggedBlogappUser'
    )
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService.create(blogObject)
      const blog = await blogService.getAll()
      setBlogs(blog)
      setClassName(notification)
      setMessage(`a new blog ${blogObject.title} by ${blogObject.author}`)
    } catch (exception) {
      setClassName(errormessage)
      setMessage(`please provide ${blogObject.title === '' ? `title ${blogObject.url === '' ? 'and url' : ''}` : 'url'}`)
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateBlog = async (id, blogObject) => {
    try {
      await blogService.update(id, blogObject)
      const blog = await blogService.getAll()
      setBlogs(blog)
      setClassName(notification)
      setMessage(`updated blog ${blogObject.title} by ${blogObject.author}`)
    } catch (exception) {
      setClassName(errormessage)
      setMessage(`please provide ${blogObject.title === '' ? `title ${blogObject.url === '' ? 'and url' : ''}` : 'url'}`)
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const deleteBlog = async (blogObject) => {
    if(window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      await blogService.del(blogObject.id)
      const blog = await blogService.getAll()
      setBlogs(blog)
      setClassName(notification)
      setMessage(`deleted blog ${blogObject.title} by ${blogObject.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const notificationMessage = (message, className) => {
    if (message === null) {
      return null
    }

    return (
      <div className={className}>
        {message}
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notificationMessage(message, className)}
        <LoginForm handleSubmit={handleLogin} handleUsernameChange={({ target }) => setUsername(target.value)} handlePasswordChange={({ target }) => setPassword(target.value)} username={username} password={password} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notificationMessage(message, className)}
      <p>
        {user.name} logged in <button onClick = {() => handleLogout()}>logout</button>
      </p>
      {blogForm()}
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App