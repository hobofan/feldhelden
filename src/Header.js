import React, { useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";

import * as api from './api';
import { useAuth0 } from "./react-auth0-spa";

const Header = () => {
    const { isAuthenticated, loginWithRedirect, logout, user,getIdTokenClaims } = useAuth0();
    const [jwt, setJwt] = useState();

    const [navExpanded, setNavExpanded] = useState(false);
    const [currentUser, setcurrentUser] = useState();
    let p =  (isAuthenticated && user) ? "p-2" : "p-4";
    const hiddenClass = navExpanded ? "" : "hidden";

    useEffect(() => {
        if (!isAuthenticated || jwt) {
            return;
        }
        async function fetch() {
            const newJwt = (await getIdTokenClaims()).__raw;
            if (jwt) {
                return;
            }
            setJwt(newJwt);
        }
        fetch();
    }, [isAuthenticated, getIdTokenClaims, setJwt, jwt]);


    useEffect(() => {
        if (!jwt) {
            return;
        }
        api.fetchCurrentUser(jwt).then((currentUser) => {
            if (currentUser?.currentUser?._id) {
                setcurrentUser(currentUser.currentUser)
            }
        });
    }, [isAuthenticated, jwt]);

    console.log(currentUser)

    return (
      <nav className={`flex items-center justify-between flex-wrap ${p}`}>
        <div className="flex items-center flex-shrink-0 text-white mr-6">
            <Link to="/" >
                <img src="/feldhelden-logo-placeholder-v1.png" style={{maxWidth: "150px"}} />
            </Link>
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
          <div className="text-sm lg:flex-grow" style={{textAlign: "right", marginRight: "40px"}}>

              { (isAuthenticated && currentUser) && (
              <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-right text-brown hover:text-white mr-4">
                  { (currentUser.userType === "HELPER") ? "Gesuchte Feldhelden" : "Mein Gesuch"}
              </Link>)}

              { (isAuthenticated && currentUser && currentUser.userType === "HELPER") && (
                  <Link to="/helper/applications" className="block mt-4 lg:inline-block lg:mt-0 text-right text-brown hover:text-white mr-4">
                     Meine Bewerbungen
                  </Link>
              )}
              {!isAuthenticated && (<button
                  className="block mt-4 lg:inline-block lg:mt-0 text-right text-brown hover:text-white"
                  onClick={() => {
                      loginWithRedirect({ landhelden_login_hint: 'signUp' })
                  }}
              >
                  Feldheld werden
              </button>)}
          </div>

              {!isAuthenticated && (
                  <button  className="inline-block text-sm px-4 py-2 leading-none border rounded text-brown border-brown hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                           onClick={() => loginWithRedirect({
                      redirect_uri: `${api.getUrlBaseRedirects()}/signup`
                  })}>Einloggen</button>
              )}

              {isAuthenticated && <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-brown border-brown hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                                           onClick={() => logout()}>Ausloggen</button>}
              {isAuthenticated && user &&  <img className="inline-block leading-none h-16 sm:h-16 rounded-full ml-2" src={user.picture}/>}

        </div>
      </nav>


    )
};

export default Header;
