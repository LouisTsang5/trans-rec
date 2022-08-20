import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar: FunctionComponent = () => {
    const navigate = useNavigate();
    return (
        <nav className="navbar navbar-light bg-light px-1 d-flex justify-content-center">
            <a className="navbar-brand" href="#" onClick={() => navigate('/')}>
                <img src="/favicon.ico" width={30} height={30} className="d-inline-block align-top" />
                <span className="px-1">TransRec</span>
            </a>
        </nav>
    );
};

export default NavBar;