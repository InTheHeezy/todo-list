export const TODO_ACTIONS = {
    //Fetch
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
    FETCH_STATS_START: 'FETCH_STATS_START',
    FETCH_STATS_SUCCESS: 'FETCH_STATS_SUCCESS',
    FETCH_STATS_ERROR: 'FETCH_STATS_ERROR',

    //Todo operations
    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',
    COMPLETE_TODO_START: 'COMPLETE_TODO_START',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
    COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',
    UPDATE_TODO_START: 'UPDATE_TODO_START',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',
    INCREMENT_VERSION: 'INCREMENT_VERSION',

    //UI operations
    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
    RESET_FILTERS: 'RESET_FILTERS'

};

export const initialTodoState = {
    
    todoList: [],
    error: '',
    filterError: '',
    statsError: '',
    isTodoListLoading: true,
    isStatsLoading: true,
    profileStats: { total: 0, completed: 0, active: 0 },
    sortBy: 'createdAt',
    sortDirection: 'desc',
    filterTerm: '',
    dataVersion: 0

};

export function todoReducer(state, action) {
    switch (action.type) {

        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                isTodoListLoading: true,
                error: '',
                filterError: ''
            };

        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: action.payload,
                error: '',
                filterError: ''
            };
        
        case TODO_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                error: '',
                filterError: ''
            };    

        case TODO_ACTIONS.FETCH_STATS_START:
            return {
                ...state,
                isStatsLoading: true,
                statsError: ''
            }

        case TODO_ACTIONS.FETCH_STATS_SUCCESS:
            return {
                ...state,
                isStatsLoading: false,
                profileStats: action.payload.profileStats,
                statsError: ''
            }   
            
        case TODO_ACTIONS.FETCH_STATS_ERROR:
            return {
                ...state,
                isStatsLoading: false,
                statsError: action.payload
            }

        case TODO_ACTIONS.ADD_TODO_START:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: [action.payload, ...state.todoList],
                error: '',
                filterError: ''
            };    
        
        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.map((todo) => 
                    todo.id === action.payload.tempId ? action.payload.serverTodo : todo
                ),
                error: '',
                filterError: ''
            };    
        
        case TODO_ACTIONS.ADD_TODO_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.filter((todo) => todo.id !== action.payload.tempId),
                error: action.payload.error,
                filterError: ''
            };    

        case TODO_ACTIONS.COMPLETE_TODO_START:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.map((todo) => 
                    todo.id === action.payload.id ? { ...todo, isCompleted: true } : todo
                ),
                error: '',
                filterError: ''
            };    

        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                error: '',
                filterError: ''
            };    

        case TODO_ACTIONS.COMPLETE_TODO_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.map((todo) => 
                    todo.id === action.payload.id ? action.payload.originalTodo : todo
                ),
                error: action.payload.error,
                filterError: ''
            };    

        case TODO_ACTIONS.UPDATE_TODO_START:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.map((todo) => 
                    todo.id === action.payload.id ? action.payload  : todo
                ),
                error: '',
                filterError: ''
            };    

        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                error: '',
                filterError: ''
            };    

        case TODO_ACTIONS.UPDATE_TODO_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.map((todo) => 
                    todo.id === action.payload.id ? action.payload.originalTodo : todo
                ),
                error: action.payload.error,
                filterError: ''
            };    

        case TODO_ACTIONS.INCREMENT_VERSION:
            return {
                ...state, 
                dataVersion: state.dataVersion + 1
            }

        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.payload.sortBy || state.sortBy,
                sortDirection: action.payload.sortDirection || state.sortDirection,
                error: '',
                filterError: ''
            };    

        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterTerm: action.payload,
                error: '',
                filterError: ''
            };    

        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: '',
            };    
           
        case TODO_ACTIONS.CLEAR_FILTER_ERROR:
            return {
                ...state,
                filterError: ''
            }    

        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filterTerm: '',
                sortBy: 'createdAt',
                sortDirection: 'desc',
                error: '',
                filterError: ''
            };    

        default: 
            throw new Error(`Unknown action type: ${action.type}`);
    }
}