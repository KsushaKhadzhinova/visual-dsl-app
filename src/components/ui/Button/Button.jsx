import './Button.css';

const Button = ({ text, type = "primary", icon: Icon }) => {
    return (
        <button className={`btn btn--${type}`}>
            {Icon && <Icon size={16} />}
            <span>{text}</span>
        </button>
    );
};

export default Button;