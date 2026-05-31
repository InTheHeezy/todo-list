import { useRef } from "react";
import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";

function TodoForm({ onAddTodo }) {

  const inputRef = useRef(null);
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleAddTodo = (event) => {
    event.preventDefault();

    if(!isValidTodoTitle(workingTodoTitle)) return;

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
    inputRef.current.focus();
  };

    return (
        <form onSubmit={handleAddTodo}>
          <TextInputWithLabel 
            elementId="todoTitle"
            labelText="Todo"
            onChange={(e) => setWorkingTodoTitle(e.target.value)}
            inputRef={inputRef}
            value={workingTodoTitle}
          />
          <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
            Add Todo
          </button>
        </form>
    );
}

export default TodoForm;