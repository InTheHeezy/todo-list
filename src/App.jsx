import './App.css'
import Header from './shared/Header'
import TodosPage from './features/Todos/TodosPage'
import { Logon } from './features/Logon'
import { useState } from 'react'
import { useAuth } from './contexts/AuthContext' 

export default function App() {

  const { isAuthenticated } = useAuth();

  return(
    <>
      <Header />
      {isAuthenticated? (
        <TodosPage />
      ) : (
        <Logon />
      )}
    </>
  )
}