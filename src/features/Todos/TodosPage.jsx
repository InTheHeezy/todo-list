import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../../shared/SortBy';
import useDebounce from '../../utils/useDebounce';
import { useEffect, useCallback, useReducer } from 'react';
import FilterInput from '../../shared/FilterInput';
import { initialTodoState, TODO_ACTIONS, todoReducer } from '../../reducers/todoReducer';

export default function TodosPage({ token }) {
    
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);
    const debouncedFilterTerm = useDebounce(state.filterTerm, 300);

    useEffect(() => {
        if (!token) return;

        const fetchTodos = async () => {
            
            dispatch ({ type: TODO_ACTIONS.FETCH_START });

            const paramsObject = {
                sortBy: state.sortBy,
                sortDirection: state.sortDirection
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
                if (debouncedFilterTerm || state.sortBy !== 'createdAt' || state.sortDirection !== 'desc') {
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
    },[token, state.sortBy, state.sortDirection, debouncedFilterTerm]);

    const invalidateCache = useCallback(() => {
        dispatch ({
            type: TODO_ACTIONS.INCREMENT_VERSION
        });
        //console.log("Invalidating memo cache after todo mutation");
    },[]);

    async function updateTodo(editedTodo) {
        const originalTodo = state.todoList.find((todo) => todo.id === editedTodo.id);
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
        const originalTodo = state.todoList.find((todo) => todo.id === id);
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

    return (
        <div>
            {state.error && ( 
                <div>
                    <p>{state.error}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR})}>Clear Error</button>
                </div>
            )}
            {state.filterError && (
                <div>
                    <p>{state.filterError}</p>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>Clear Filter Error</button>
                    <button onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}>Reset Filters</button>
                </div>
            )}
            {state.isTodoListLoading && (
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
                todoList={state.todoList} 
                onCompleteTodo={completeTodo} 
                onUpdateTodo={updateTodo}
                dataVersion={state.dataVersion}
            />
        </div>
    );
}