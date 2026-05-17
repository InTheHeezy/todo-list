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
            setError('');
            setIsTodoListLoading(true);
            try {
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

    async function addTodo(todoTitle) {
        setError('');
        const newTodo = {
        id: Date.now(),
        title: todoTitle,
        isCompleted: false
        };
        setTodoList(previous => [newTodo, ...previous]);
        try {
            const response = await fetch('/api/tasks', {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                 },
                credentials: 'include',
                body:JSON.stringify({
                    title: newTodo.title,
                    isCompleted: newTodo.isCompleted
                })
            });
            if(!response.ok) setError('Failed to add todo');

            const serverTodo = await reponse.json();
            setTodoList((prevList) => 
                prevList.map((todo) => (todo.title === newTodo.title ? serverTodo : todo))
            );
        } catch (error) {
            setTodoList((prevList) => prevList.filter((todo) => todo.name !== newTodo.name));
            setError("Failed to add todo");
        } 
    }

    async function completeTodo (id) {  
        setError('');
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