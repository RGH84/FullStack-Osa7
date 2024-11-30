import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationSlice'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog,
      )
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogsSlice.actions

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export const createBlog = (newBlog) => async (dispatch) => {
  if (!newBlog.title || !newBlog.author) {
    dispatch(showNotification('Title and author are required', 'error'))
    return
  }

  try {
    const createdBlog = await blogService.create(newBlog)
    dispatch(appendBlog(createdBlog))

    dispatch(
      showNotification(
        `A new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success',
      ),
    )
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to create blog'
    dispatch(showNotification(errorMessage, 'error'))
  }
}

export const likeBlog = (blog) => async (dispatch) => {
  try {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    dispatch(updateBlog(returnedBlog))

    dispatch(showNotification(`You liked '${returnedBlog.title}'`, 'success'))
  } catch (error) {
    dispatch(showNotification('Failed to like the blog', 'error'))
  }
}

export const deleteBlog = (id, title) => async (dispatch) => {
  try {
    await blogService.remove(id)
    dispatch(removeBlog(id))
    dispatch(
      showNotification(`Blog '${title}' was removed successfully`, 'success'),
    )
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Failed to delete the blog'
    dispatch(showNotification(errorMessage, 'error'))
  }
}

export const fetchBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export default blogsSlice.reducer
