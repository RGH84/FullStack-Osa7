import { createSelector } from 'reselect'

export const selectSortedBlogs = createSelector(
  (state) => state.blogs,
  (blogs) => [...blogs].sort((a, b) => b.likes - a.likes),
)
