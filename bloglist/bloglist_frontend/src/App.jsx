import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'
import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import CreateUser from './components/CreateUser'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { initializeBlogs, createBlog } from './reducers/blogsSlice'
import { initializeUser, login, logout, createUser } from './reducers/userSlice'
import './App.css'
import { selectSortedBlogs } from './selectors/blogsSelectors'
import UserList from './components/UserList'
import User from './components/User'
import BlogDetail from './components/BlogDetail'

const App = () => {
  const blogs = useSelector(selectSortedBlogs)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const linkStyle = {
    padding: 5,
    textDecoration: 'none',
    color: 'blue',
  }

  return (
    <Router>
      <div className="container">
        <nav
          style={{
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderBottom: '1px solid #ccc',
          }}
        >
          {!user ? (
            <>
              <Link style={linkStyle} to="/login">
                Login
              </Link>
              <Link style={linkStyle} to="/create-user">
                Create user
              </Link>
            </>
          ) : (
            <>
              <Link style={linkStyle} to="/">
                Blogs
              </Link>
              <Link style={linkStyle} to="/users">
                Users
              </Link>
              <span style={{ marginLeft: '10px' }}>
                {user.name} logged in{' '}
                <button
                  onClick={() => dispatch(logout())}
                  style={{ marginLeft: '10px' }}
                >
                  Logout
                </button>
              </span>
            </>
          )}
        </nav>

        <h1>BLOG APP</h1>
        <Notification />

        <Routes>
          {!user ? (
            <>
              <Route
                path="/login"
                element={
                  <div>
                    <LoginForm
                      createLogin={(credentials) =>
                        dispatch(login(credentials))
                      }
                    />
                  </div>
                }
              />
              <Route
                path="/create-user"
                element={
                  <div>
                    <CreateUser
                      createUser={(newUser) => dispatch(createUser(newUser))}
                    />
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <div>
                    <Togglable buttonLabel="create new" ref={blogFormRef}>
                      <BlogForm
                        createBlog={(blogObject) =>
                          dispatch(createBlog(blogObject))
                        }
                      />
                    </Togglable>
                    <h2>Blogs</h2>
                    {blogs.map((blog) => (
                      <Blog key={blog.id} blog={blog} />
                    ))}
                  </div>
                }
              />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/:id" element={<User />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App
