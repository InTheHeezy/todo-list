import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../../shared/SortBy';
import useDebounce from '../../utils/useDebounce';
import { useState, useEffect, useCallback, useReducer } from 'react';
import FilterInput from '../../shared/FilterInput';
import { initialTodoState, TODO_ACTIONS, todoReducer } from '../../reducers/todoReducer';

export default function TodosPage({ token }) {
    
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);

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
            
            dispatch ({ type: TODO_ACTIONS.FETCH_START });

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
                
                dispatch ({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: tasks })

            } catch (error) {
                if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
                    dispatch ({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: { filterError: `Error filtering/sorting todos: ${error.message}` }
                    })
                } else {
                    dispatch ({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: { error: `Error fetching todos: ${error.message}` }
                    })
                }
            } 
        };

        fetchTodos();
    },[token, sortBy, sortDirection, debouncedFilterTerm]);

    const invalidateCache = useCallback(() => {
        setDataVersion(prev => prev + 1);
        //console.log("Invalidating memo cache after todo mutation");
    },[]);

    async function updateTodo(editedTodo) {
        const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
        if(!originalTodo) return;

        dispatch ({
            type: TODO_ACTIONS.UPDATE_TODO_START,
            payload: editedTodo
        });

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
                })
            });
            if(!response.ok) throw new Error('Failed to update todo');
            invalidateCache();
            
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_SUCCESS
            });

        } catch (error) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ERROR,
                payload: { id: editedTodo.id, originalTodo: originalTodo, error: 'Failed to update todo'}
            });
        }
    }

    async function addTodo(todoTitle) {
        const tempId = Date.now().toString();
        const newTodo = {
        id: tempId,
        title: todoTitle,
        isCompleted: false
        };
        
        dispatch ({
            type: TODO_ACTIONS.ADD_TODO_START,
            payload: newTodo
        });

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

            dispatch ({
                type: TODO_ACTIONS.ADD_TODO_SUCCESS,
                payload: { tempId, serverTodo }
            });
        } catch (error) {
            dispatch ({
                type: TODO_ACTIONS.ADD_TODO_ERROR,
                payload: { tempId, error: "Failed to add todo" }
            })
        } 
    }

    async function completeTodo (id) {  
        const originalTodo = todoList.find((todo) => todo.id === id);
        if (!originalTodo) return;

        dispatch ({
            type: TODO_ACTIONS.COMPLETE_TODO_START,
            payload: { id }
        });

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
                })
            })
            if(!response.ok) throw new Error('Failed to complete todo');
            invalidateCache();

            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS
            });

        } catch (error) {
            
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
                payload: { id, originalTodo, error: 'Failed to complete todo' }
            });

        }
    }

    const handleFilterChange = (newTerm) => { setFilterTerm(newTerm); };

    return (
        <div>
            {error && ( 
                <div>
                    <p>{error}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR})}>Clear Error</button>
                </div>
            )}
            {filterError && (
                <div>
                    <p>{filterError}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}>Reset Filters</button>
                </div>
            )}
            {isTodoListLoading && (
                <div>Loading todo list...</div>
            )}
            <SortBy 
                sortBy={state.sortBy} 
                onSortByChange={(newSortBy) => 
                    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy: newSortBy} })} 
                sortDirection={state.sortDirection} 
                onSortDirectionChange={(newDirection) => 
                    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortDirection: newDirection} })}
            />
            <FilterInput 
                filterTerm={state.filterTerm}
                onFilterChange={(newFilter) => 
                    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newFilter })}
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