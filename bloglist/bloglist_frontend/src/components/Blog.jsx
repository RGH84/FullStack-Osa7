import React from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} data-testid={`blog-${blog.id}`}>
      <Table striped>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} by {blog.author}
        </Link>
      </Table>
    </div>
  )
}

export default Blog
