export default function TextInputWithLabel({ 
    elementId, 
    labelText,
    onChange,
    inputRef,
    value
}) {
    
    return (
        <div className="input-group">
            <label htmlFor={elementId}>{labelText}</label>  
            <input 
                type="text" 
                id={elementId}
                ref={inputRef}
                value={value}
                onChange={onChange}
                placeholder="Add a todo..."
            />
        </div>      
    );
}