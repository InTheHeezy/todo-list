import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";

function TodoListItem({todo = {}, onCompleteTodo, onUpdateTodo}) {
    
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTodoTitle] = useState(todo.title);

    const handleCancel = () => {
        setWorkingTodoTitle(todo.title);
        setIsEditing(false);
    }

    const handleEdit = (event) => {
        setWorkingTodoTitle(event.target.value);
    }

    const handleUpdate = (event) => {
        if (!isEditing) return;

        event.preventDefault();

        if(!isValidTodoTitle(workingTitle)) return;

        onUpdateTodo({ ...todo, title: workingTitle })
        setIsEditing(false);
    }

    return (
        <li>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <TextInputWithLabel 
                        value={workingTitle}
                        onChange={handleEdit}
                    />
                    <button type="button" onClick={handleCancel}>
                        Cancel 
                    </button>
                    <button type="button" onClick={handleUpdate}>
                        Update
                    </button>
                </form> 
            ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                            <span onClick={() => setIsEditing(true)}>
                                {todo.title} 
                            </span>     
                        </label>
                    </>
                )}
        </li>
    );
}

export default TodoListItem;