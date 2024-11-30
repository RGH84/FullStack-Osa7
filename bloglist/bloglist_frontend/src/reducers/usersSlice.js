import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/userService'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const { setUsers } = usersSlice.actions

export const fetchUsers = () => async (dispatch) => {
  const users = await userService.getAll()
  dispatch(setUsers(users))
}

export const selectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId)

export default usersSlice.reducer
