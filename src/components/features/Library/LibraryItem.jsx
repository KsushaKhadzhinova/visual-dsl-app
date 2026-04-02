import './Library.css';

const LibraryItem = ({ template }) => (
    <div className="lib-item">
        <h4>{template.title}</h4>
        <div className="lib-meta">
            <span>{template.lang}</span>
            <span className="badge">{template.complexity}</span>
        </div>
    </div>
);

export default LibraryItem;