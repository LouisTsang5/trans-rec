import { FunctionComponent } from 'react';

const NavBar: FunctionComponent = () => {
    return (
        <nav className="navbar navbar-light bg-light px-1">
            <a className="navbar-brand" href="#">
                <img src="/favicon.ico" width={30} height={30} className="d-inline-block align-top" />
                <span className="px-1">TransRec</span>
            </a>
        </nav>
    );
};

export default NavBar;