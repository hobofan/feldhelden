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
            <div className="signup-page h-screen">
                <div className="container flex">
                    <div className="carrotImg">
                        <img src="/felden-werner-hero-v1.png" />
                    </div>
                    <div className="headlineContainer">
                        <div>
                            <h1>Werde der Held</h1>
                            <h1>vom <span clasName="green">Erdbeerfeld</span></h1>

                        </div>
                        <div>
                            <div>
                            <p>Für Jobsuchende</p>
                                <button className="bg-green-400 rounded px-2 py-2 hover:bg-green-700 cursor-pointer"
                                onClick={() => {
                                    loginWithRedirect()
                                }}
                                >
                                    Jetzt anmelden
                                </button>
                            </div>
                            <div>
                                <p>Für Landwirte</p>
                                <button className="bg-green-400 rounded px-2 py-2 hover:bg-green-700 cursor-pointer"
                                onClick={() => {
                                    loginWithRedirect()
                                }}
                                >
                                    Jobs kostenlos eintragen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        
        )

    }
};

export default IndexPage;
