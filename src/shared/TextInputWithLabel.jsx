import styles from './TextInputWithLabel.module.css'

export default function TextInputWithLabel({ 
    elementId, 
    labelText,
    onChange,
    inputRef,
    value,
    maxLength = 100
}) {
    
    return (
        <div className={styles.inputGroup}>
            <label htmlFor={elementId}>{labelText}</label>  
            <input 
                type="text" 
                id={elementId}
                ref={inputRef}
                value={value}
                onChange={onChange}
                placeholder="Add a todo..."
                maxLength={maxLength}
            />
        </div>      
    );
}