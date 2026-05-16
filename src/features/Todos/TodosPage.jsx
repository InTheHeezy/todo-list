import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import { useState, useEffect } from 'react';

export default function TodosPage({ token }) {
    
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchTodos = async () => {
            try {
                setIsTodoListLoading(true);
                const response = await fetch('/api/tasks', {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN' : token },
                    credentials: 'include'
                });
                if(response.status === 401) throw new Error('unauthorized');
                if(!response.ok) throw new Error('Something went wrong');
            } catch (error) {
                setError(error.message);
            } finally {
                setIsTodoListLoading(false);
            }
        };

        fetchTodos();
    },[token]);

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