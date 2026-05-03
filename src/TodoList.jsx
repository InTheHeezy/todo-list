import TodoListItem from "./TodoListItem";

function TodoList({todoList, onCompleteTodo}) {

  const filteredTodoList = todoList.filter(todo => todo.isCompleted === false);

  return (
    <ul>
      {filteredTodoList.length === 0 ? <p> Add todo above to get started </p>: null} 
      {filteredTodoList.map((todo) => {
        return(
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
          />
        );
      })}
    </ul>
  );
}

export default TodoList;