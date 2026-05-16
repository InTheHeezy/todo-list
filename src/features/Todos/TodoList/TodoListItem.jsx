import { useState } from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import { useEditableTitle } from "../../../hooks/useEditableTitle";

function TodoListItem({todo = {}, onCompleteTodo, onUpdateTodo}) {
    
    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit
    } = useEditableTitle(todo.title);

    const handleCancel = () => {
        cancelEdit();
    }

    const handleEdit = (event) => {
        updateTitle(event.target.value);
    }

    const handleUpdate = (event) => {
        if (!isEditing) return;
        event.preventDefault();
        const finalTitle = finishEdit();
        onUpdateTodo({ ...todo, title: finalTitle });
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
                    <button type="button" onClick={handleUpdate} disabled={!isValidTodoTitle(workingTitle)}>
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
                            <span onClick={() => startEditing()}>
                                {todo.title} 
                            </span>     
                        </label>
                    </>
                )}
        </li>
    );
}

export default TodoListItem;