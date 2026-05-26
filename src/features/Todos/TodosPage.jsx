import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../../shared/SortBy';
import useDebounce from '../../utils/useDebounce';
import { useState, useEffect, useCallback } from 'react';
import FilterInput from '../../shared/FilterInput';

export default function TodosPage({ token }) {
    
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);
    const [sortBy, setSortBy] = useState('creationDate');
    const [sortDirection, setSortDirection] = useState('desc')
    const [filterTerm, setFilterTerm] = useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300);
    const [dataVersion, setDataVersion] = useState(0);
    const [filterError, setFilterError] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchTodos = async () => {
            setIsTodoListLoading(true);
            const paramsObject = {
                sortBy,
                sortDirection
            }
            if (debouncedFilterTerm) { paramsObject.find = debouncedFilterTerm; }
            const params = new URLSearchParams(paramsObject);
            try {
                const response = await fetch(`/api/tasks?${params}`, {
                    method: 'GET',
                    headers: { 'X-CSRF-TOKEN' : token },
                    credentials: 'include'
                });
                if(response.status === 401) throw new Error('unauthorized');
                if(!response.ok) throw new Error('Something went wrong');
                const { tasks } = await response.json();
                setTodoList(tasks);
                setFilterError('');
            } catch (error) {
                if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
                    setFilterError(`Error filtering/sorting todos: ${error.message}`);
                } else {
                    setError(error.message);
                }
            } finally {
                setIsTodoListLoading(false);
            }
        };

        fetchTodos();
    },[token, sortBy, sortDirection, debouncedFilterTerm]);

    const invalidateCache = useCallback(() => {
        setDataVersion(prev => prev + 1);
    },[]);

    async function updateTodo(editedTodo) {
        const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
        if(!originalTodo) return;

        const updatedTodos = todoList.map(todo => 
        todo.id === editedTodo.id ? { ...editedTodo } : todo
        );
        setTodoList(updatedTodos);

        try {
            const response = await fetch(`/api/tasks/${editedTodo.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include',
                body:JSON.stringify({
                    title: editedTodo.title,
                    isCompleted: editedTodo.isCompleted,
                    createdAt: editedTodo.createdAt
                })
            });
            if(!response.ok) throw new Error('Failed to update todo');
            invalidateCache();
        } catch (error) {
            setTodoList((prevList) => prevList.map((todo) => (todo.id === editedTodo.id ? originalTodo : todo)));
            setError('Failed to update todo');
        }
    }

    async function addTodo(todoTitle) {
        const tempId = Date.now().toString();
        const newTodo = {
        id: tempId,
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
            if(!response.ok) throw new Error('Failed to add todo');
            invalidateCache();
            const serverTodo = await response.json();
            setTodoList((prevList) => 
                prevList.map((todo) => (todo.id === tempId ? serverTodo : todo))
            );
        } catch (error) {
            setTodoList((prevList) => prevList.filter((todo) => todo.id !== tempId));
            setError("Failed to add todo");
        } 
    }

    async function completeTodo (id) {  
        const originalTodo = todoList.find((todo) => todo.id === id);
        if (!originalTodo) return;

        const updatedTodoList = todoList.map((todo) => 
        {
        if (todo.id === id) return { ...todo, isCompleted: true}
        else return todo;
        })
        setTodoList(updatedTodoList);

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                credentials: 'include',
                body:JSON.stringify({
                    isCompleted:true,
                    createdAt: originalTodo.createdAt
                })
            })
            if(!response.ok) throw new Error('Failed to complete todo');
            invalidateCache();
        } catch (error) {
            setTodoList((prevList) => prevList.map((todo) => (todo.id === id ? originalTodo : todo)));
            setError('Failed to complete todo');
        }
    }

    const handleFilterChange = (newTerm) => { setFilterTerm(newTerm); };

    return (
        <div>
            {filterError && (
                <div>
                    <p>{filterError}</p>
                    <button onClick={() => setFilterError('')}>Clear Filter Error</button>
                    <button onClick={() => {
                        setFilterTerm('');
                        setSortBy('creationDate');
                        setSortDirection('desc');
                        setFilterError('');
                    }}>Reset Filters</button>
                </div>
            )}
            {error && ( 
                <div>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>Clear Error</button>
                </div>
            )}
            {isTodoListLoading && (
                <div>Loading todo list...</div>
            )}
            <SortBy 
                sortBy={sortBy} 
                onSortByChange={setSortBy} 
                sortDirection={sortDirection} 
                onSortDirectionChange={setSortDirection}
            />
            <FilterInput 
                filterTerm={filterTerm}
                onFilterChange={handleFilterChange}
            />
            <TodoForm 
                onAddTodo={addTodo}
            />
            <TodoList 
                todoList={todoList} 
                onCompleteTodo={completeTodo} 
                onUpdateTodo={updateTodo}
                dataVersion={dataVersion}
            />
        </div>
    );
}