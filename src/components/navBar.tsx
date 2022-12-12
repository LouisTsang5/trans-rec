import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar: FunctionComponent = () => {
    const navigate = useNavigate();

    const handleNavigation = (e: React.MouseEvent, to: string) => {
        e.preventDefault();
        navigate(to);
    };

    return (
        <nav className="navbar navbar-light bg-light px-1 d-flex">
            <div className='w-25' style={{ visibility: 'hidden' }}>A</div>

            <div className='w-50 d-flex justify-content-center'>
                <a className="navbar-brand" onClick={(e) => handleNavigation(e, '/')} style={{ marginRight: 0 }}>
                    <img src="/favicon.ico" width={30} height={30} className="d-inline-block align-top" />
                    <span className="px-1">TransRec</span>
                </a>
            </div>

            <div className='w-25 d-flex justify-content-end'>
                <div className="dropdown">
                    <button className="btn-sm navbar-toggler" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none' }}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item" onClick={(e) => handleNavigation(e, 'save')}>Save</a></li>
                        <li><a className="dropdown-item" onClick={(e) => handleNavigation(e, 'transactions')}>Transactions</a></li>
                        <li><a className="dropdown-item" onClick={(e) => handleNavigation(e, 'report')}>Report</a></li>
                    </ul>
                </div>
            </div>
        </nav >
    );
};

export default NavBar;