import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './hoc/AuthProvider'
import useAuth from './hooks/useAuth'
import { useEffect } from 'react'
import AdminAuth from './hoc/AdminAuth'
import AdminPage from './pages/AdminPage'
import LoginRegisterRedirect from './hoc/LoginRegisterRedirect'
import Page404 from './pages/Page404'
import RequireAuth from './hoc/RequireAuth'
import UserSettings from './pages/UserSettings'
import PostsPage from './pages/PostsPage'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout />}>
    <Route index element={<Home />}/>
    <Route path='/login' element={
      <LoginRegisterRedirect>
        <Login />
      </LoginRegisterRedirect>
    } />
    <Route path='/register' element={
      <LoginRegisterRedirect>
        <Register />
      </LoginRegisterRedirect>
    } />
    <Route path='/admin' element={
      <AdminAuth>
        <AdminPage />
      </AdminAuth>
    } />
    <Route path='user-settings' element={
      <RequireAuth>
        <UserSettings />
      </RequireAuth>
    } />
    <Route path='posts' element={
      <PostsPage />
    } />
    <Route path='post/:id/edit' element={
      <RequireAuth>

      </RequireAuth>
    } />
    <Route path='/*' element={
      <Page404 />
    } />
  </Route>
))

function App() {
  const store = useAuth()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
      setInterval(() => {
        store.checkAuth()
      }, 30 * 60 * 1000)
    }

  }, [store])

  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App
