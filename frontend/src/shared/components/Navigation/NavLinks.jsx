import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './NavLinks.css';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/auth-hook';

function NavLinks(props) {
  const auth = useContext(AuthContext);
  const {role} = useAuth();
  return (
    <ul className='nav-links'>
      <li>
        <NavLink to="/" end>APPLICATIONS</NavLink>
      </li>
      {auth.isLoggedIn && role === "user" && (
        <li>
          <NavLink to="/places/apply">APPLY</NavLink>
        </li>
      )}

      {/* {!auth.isLoggedIn &&
      <li>
        <NavLink to="/auth">AUTHENTICATE</NavLink>
      </li>
      } */}
      
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
}

export default NavLinks;
