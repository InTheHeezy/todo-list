import './App.css'
import Header from './shared/Header'
import TodosPage from './features/Todos/TodosPage'
import { Logon } from './features/Logon'
import { useAuth } from './contexts/AuthContext' 
import { Logoff } from './features/LogOff'

export default function App() {

  const { isAuthenticated } = useAuth();

  return(
    <>
      <Header />
      {isAuthenticated? (
        <div>
          <Logoff />
          <TodosPage />
        </div>
      ) : (
        <Logon />
      )}
    </>
  )
}