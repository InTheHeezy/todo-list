import TodoListItem from "./TodoListItem";

function TodoList({todoList, onCompleteTodo}) {
  
    return (
      <ul>
        {todoList.length === 0 ? <p> Add todo above to get started </p>: null} 
        {todoList.map((todo) => {
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