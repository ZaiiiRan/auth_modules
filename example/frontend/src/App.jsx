import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider, AuthContext } from './hoc/AuthProvider'
import { useContext, useEffect } from 'react'
import AdminAuth from './hoc/AdminAuth'
import AdminPanel from './components/AdminPanel/AminPanel'
import LoginRegisterRedirect from './hoc/LoginRegisterRedirect'
import Page404 from './pages/Page404'
import RequireAuth from './hoc/RequireAuth'
import UserSettings from './pages/UserSettings'

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
        <AdminPanel />
      </AdminAuth>
    } />
    <Route path='user-settings' element={
      <RequireAuth>
        <UserSettings />
      </RequireAuth>
    } />
    <Route path='/*' element={
      <Page404 />
    } />
  </Route>
))

function App() {
  const { store } = useContext(AuthContext)
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }

  }, [store])

  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App
