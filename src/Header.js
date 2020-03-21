import React, { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";

import * as api from './api';
import { useAuth0 } from "./react-auth0-spa";

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const [navExpanded, setNavExpanded] = useState(false);

  let p =  (isAuthenticated && user) ? "p-2" : "p-4";
  const hiddenClass = navExpanded ? "" : "hidden";
    return (
      <nav className={`flex items-center justify-between flex-wrap bg-green-500 ${p}`}>
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">Feldhelden</span>
        </div>
        <div className="block lg:hidden">
          <button
              className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
                onClick={()=>{
                    setNavExpanded(!!!navExpanded)
                }}
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
          </button>
        </div>
        <div className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${hiddenClass}`}>
          <div className="text-sm lg:flex-grow">
              <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                  Meine Feldhelden
              </Link>
            <Link to="/other" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
              Feldheld werden
            </Link>
          </div>

              {!isAuthenticated && (
                  <button  className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                           onClick={() => loginWithRedirect({
                      redirect_uri: `${api.getUrlBaseRedirects()}/signup`
                  })}>Einloggen</button>
              )}

              {isAuthenticated && <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                                           onClick={() => logout()}>Ausloggen</button>}
              {isAuthenticated && user &&  <img className="inline-block leading-none h-16 sm:h-16 rounded-full ml-2" src={user.picture}/>}

        </div>
      </nav>


  )
};

export default Header;
