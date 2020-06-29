import React from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const blogUser = { ...blog.user }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author}
      </div>
      <div className="togglable">
        <Togglable buttonLabel="view" buttonText="hide">
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={() => updateBlog(blog.id, { ...blog, likes: blog.likes + 1 })}>like</button>
          <br />
          {blogUser.name}
          <br />
          {blogUser.name === user.name ? <div><button onClick={() => deleteBlog(blog)}>remove</button></div> : null}
        </Togglable>
      </div>
    </div>
  )
}

export default Blog