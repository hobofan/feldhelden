import React, { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";

import * as api from './api';
import { useAuth0 } from "./react-auth0-spa";

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav>
      <div className="container mx-auto my-3 flex justify-between">
        <span>
          <Link to="/">Home / Logo</Link>
        </span>
        <span>
          <Link to="/other">Other</Link>
        </span>
        <span className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          {!isAuthenticated && (
            <button onClick={() => loginWithRedirect({
              redirect_uri: `${api.getUrlBaseRedirects()}/signup`
            })}>Einloggen</button>
          )}

          {isAuthenticated && <button onClick={() => logout()}>Ausloggen</button>}
        </span>
      </div>
    </nav>
  );
}

export default Header;
