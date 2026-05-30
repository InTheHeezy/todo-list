export const TODO_ACTIONS = {
    //Fetch
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    //Todo operations
    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',
    COMPLETE_TODO: 'COMPLETE_TODO',
    UPDATE_TODO: 'UPDATE_TODO',

    //UI operations
    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET_FILTERS: 'RESET_FILTERS'

};

export const initialTodoState = {
    
    todoList: [],
    error: '',
    filterError: '',
    isTodoListLoading: false,
    sortBy: 'creationDate',
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

        case FETCH_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: action.payload,
                error: '',
                filterError: ''
            };
        
        case FETCH_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                error: action.payload.error,
                filterError: action.payload.filterError
            };    

        case ADD_TODO_START:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: [action.payload, ...state.todoList],
                error: '',
                filterError: ''
            };    
        
        case ADD_TODO_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.map((todo) => 
                    todo.id === action.payload.tempId ? action.payload.serverTodo : todo
                ),
                error: '',
                filterError: ''
            };    
        
        case ADD_TODO_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: state.todoList.filter((todo) => todo.id !== action.payload.tempId),
                error: action.payload.error,
                filterError: ''
            };    

        case COMPLETE_TODO:
            return {
                
            };    

        case UPDATE_TODO:
            return {

            };    

        case SET_SORT:
            return {

            };    

        case SET_FILTER:
            return {

            };    

        case CLEAR_ERROR:
            return {

            };    

        case RESET_FILTERS:
            return {

            };    

        default: 
            throw new Error(`Unknown action type: ${action.type}`);
    }
}