import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar: FunctionComponent = () => {
    const navigate = useNavigate();
    return (
        <nav className="navbar navbar-light bg-light px-1 d-flex">
            <div className='w-25' style={{ visibility: 'hidden' }}>A</div>

            <div className='w-50 d-flex justify-content-center'>
                <a className="navbar-brand" href="#" onClick={() => navigate('/')} style={{ marginRight: 0 }}>
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
                        <li><a className="dropdown-item" href="#" onClick={() => navigate('save')}>Save</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => navigate('transactions')}>Transactions</a></li>
                    </ul>
                </div>
            </div>
        </nav >
    );
};

export default NavBar;