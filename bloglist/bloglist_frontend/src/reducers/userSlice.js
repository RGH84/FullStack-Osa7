import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import createUserService from '../services/createUser'
import { showNotification } from './notificationSlice'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const login =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch({
        type: 'notification/showNotification',
        payload: { message: `Welcome, ${user.name}!`, type: 'success' },
      })
    } catch (error) {
      dispatch({
        type: 'notification/showNotification',
        payload: { message: 'Wrong username or password', type: 'error' },
      })
    }
  }

export const logout = () => (dispatch) => {
  window.localStorage.removeItem('loggedBlogappUser')
  blogService.setToken(null)
  dispatch(clearUser())
  dispatch({
    type: 'notification/showNotification',
    payload: { message: 'Logged out successfully', type: 'success' },
  })
}

export const initializeUser = () => (dispatch) => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export const createUser =
  ({ username, name, password }) =>
  async (dispatch) => {
    try {
      const newUser = await createUserService.create({
        username,
        name,
        password,
      })
      dispatch(
        showNotification(
          `User ${newUser.username} created successfully!`,
          'success',
        ),
      )
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to create user'
      dispatch(showNotification(errorMessage, 'error'))
    }
  }

export default userSlice.reducer
