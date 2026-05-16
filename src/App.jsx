import './App.css'
import Header from './shared/Header'
import TodosPage from './features/Todos/TodosPage'
import { Logon } from './features/Logon'

export default function App() {

  return(
    <>
      <Header />
      <TodosPage />
      <Logon />
    </>
  )
}