import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({todo = {}, onCompleteTodo}) {
    
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTodoTitle] = useState(todo.title);

    const handleCancel = () => {
        setWorkingTodoTitle(todo.title);
        setIsEditing(false);
    }

    const handleEdit = (event) => {
        setWorkingTodoTitle(event.target.value);
    }

    return (
        <li>
            <form>
                {isEditing ? (
                    <>
                        <TextInputWithLabel 
                            value={workingTitle}
                            onChange={handleEdit}
                        />
                        <button type="button" onClick={() => handleCancel}>
                            Cancel 
                        </button>
                    </> 
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
            </form>
        </li>
    );
}

export default TodoListItem;