import './EditorField.css';

const EditorField = ({ codeSnippet }) => {
    return (
        <div className="editor-container">
            <div className="editor-tab">input.dsl</div>
            <textarea 
                className="editor-textarea" 
                defaultValue={codeSnippet} 
                spellCheck="false"
            />
        </div>
    );
};

export default EditorField;