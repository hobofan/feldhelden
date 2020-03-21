import './IndexPage.css';
import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import * as api from '../api';
import {useAuth0} from "../react-auth0-spa";

import {LoadingSpinner} from "../components/Loading";


const IndexPage = () => {
    const {isAuthenticated, getIdTokenClaims, user, loginWithRedirect, loading} = useAuth0();
    const [jwt, setJwt] = useState();
    const history = useHistory();


    useEffect(() => {
        if (isAuthenticated) {
            history.replace("/signup");
            return;
        }else{
            return
        }
    }, [isAuthenticated]);

    if (loading) {
        return ( <div className="signup-page flex h-screen"> <LoadingSpinner /> </div>)

    }else {
        return(
            <div className="signup-page flex h-screen">
                <div className="flex m-auto">
                    <button className="bg-green-400 rounded px-2 py-2 shadow hover:bg-green-700 cursor-pointer"
                    onClick={() => {
                        loginWithRedirect()
                    }}
                    >
                        Jetzt anmelden
                    </button>
                </div>
            </div>
        )

    }
};

export default IndexPage;
