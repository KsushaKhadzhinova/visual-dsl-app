import { Play, Sparkles, Box } from 'lucide-react';
import Button from '../../ui/Button/Button';
import './Header.css';

const Header = ({ title }) => {
    return (
        <header className="header">
            <div className="header__brand">
                <Box size={24} className="logo" />
                <h1>{title}</h1>
            </div>
            <nav className="header__nav">
                <Button text="Run" icon={Play} />
                <Button text="Generate AI" type="ai" icon={Sparkles} />
            </nav>
        </header>
    );
};

export default Header;