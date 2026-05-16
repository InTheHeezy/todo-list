import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import { useState } from 'react';

export default function TodosPage() {
    
    const [todoList, setTodoList] = useState([]);

    function updateTodo(editedTodo) {
        const updatedTodos = todoList.map(todo => 
        todo.id === editedTodo.id ? { ...editedTodo } : todo
        );
        setTodoList(updatedTodos);
    }

    function addTodo(todoTitle) {
        const newTodo = {
        id: Date.now(),
        title: todoTitle,
        isCompleted: false
        };
        setTodoList(previous => [newTodo, ...previous]);
    }

    function completeTodo (id) {  
        const updatedTodoList = todoList.map((todo) => 
        {
        if (todo.id === id) return { ...todo, isCompleted: true}
        else return todo;
        })
        setTodoList(updatedTodoList);
    }

    return (
        <div>
        <TodoForm onAddTodo={addTodo}/>
        <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
        </div>
    );
}