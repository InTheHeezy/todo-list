import './App.css'

function App() {

  const todoList = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
  ]

  return (
    <div>
      <h1>My Todos</h1>
      <u1>
        {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </u1>
    </div>
  );
}

export default App
