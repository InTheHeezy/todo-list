import './App.css'
import Header from './shared/Header'
import TodosPage from './features/Todos/TodosPage'
import { Logon } from './features/Logon'
import { useState } from 'react'

export default function App() {

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return(
    <>
      <Header onSetEmail={setEmail} token={token} onSetToken={setToken}/>
      {token ? (
        <TodosPage token={token}/>
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken}/>
      )}
    </>
  )
}