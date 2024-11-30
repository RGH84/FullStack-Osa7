import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchBlogs, likeBlog, deleteBlog } from '../reducers/blogsSlice'

const BlogDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id),
  )

  const user = useSelector((state) => state.user)

  if (!blog) {
    return null
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to remove the blog '${blog.title}'?`,
      )
    ) {
      dispatch(deleteBlog(blog.id, blog.title))
    }
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>
        URL:{' '}
        <a
          href={blog.url.startsWith('http') ? blog.url : `http://${blog.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {blog.url}
        </a>
      </p>
      <p>
        Likes: {blog.likes}{' '}
        <button onClick={() => dispatch(likeBlog(blog))}>Like</button>
      </p>
      <p>Added by: {blog.user.name}</p>
      {user?.username === blog.user.username && (
        <button onClick={handleDelete}>Remove</button>
      )}
      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  )
}

export default BlogDetail
