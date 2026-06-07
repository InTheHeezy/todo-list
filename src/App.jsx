import './App.css'
import { Route, Routes } from 'react-router'
import Header from './shared/Header'
import TodosPage from './pages/TodosPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import { Logoff } from './features/LogOff'

export default function App() {
  return(
    <>
      <Header />
      <Routes>
        <Route to="/" element={<HomePage />} />
        <Route to="/about" element={<AboutPage />} />
        <Route to="/login" element={<LoginPage />} />
        <Route to="/todos" element={
          <RequireAuth>
            <TodosPage />
          </RequireAuth>
          }
        />
        <Route to="/profile" element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
          }
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}