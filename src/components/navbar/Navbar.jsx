import React from 'react';
import './Navbar.scss'
import { Search, ExitToApp } from '@material-ui/icons';
import {
    Link,
    useHistory
} from "react-router-dom";
import { isAuthenticated ,logout} from '../../api_Interface/api_interface';

const Navbar = () => {
    const history=useHistory();

    const handleLogout = async()=>{
        logout();
        history.push('/auth');
    }
    return (
        <div className="nav">
            <div className="nav-body">
                <div className="nav-container">
                    <Link to="/">
                        <h2 className="nav-logo">
                            <span className="sec-color font-large">Z</span><span>eflex</span>
                        </h2>
                    </Link>
                    <ul className="nav-items">
                        <Link to="/movies" className="nav-item">Home</Link>
                        <Link to="/discover" className="nav-item">Discover</Link>
                    </ul>
                </div>
                <div className="right">
                    <div className="search">
                        <Search className="icon" />
                        <form action="/movies" method="get">
                        <input name="q" type="text" placeholder="Search ..." />
                        </form>
                    </div>
                    {isAuthenticated() ?
                        <ExitToApp className="icon" onClick={handleLogout}/>
                        :<Link to={'/auth'}>Log in</Link>
                    }
                </div>
            </div>

        </div>
    );
}

export default Navbar;
