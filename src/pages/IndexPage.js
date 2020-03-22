import './IndexPage.css';
import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import * as api from '../api';
import {useAuth0} from "../react-auth0-spa";

import {LoadingSpinner} from "../components/Loading";


const IndexPage = () => {
    const TITLE_HE = "der Held";
    const TITLE_SHE = "die Heldin";

    const {isAuthenticated, getIdTokenClaims, user, loginWithRedirect, loading} = useAuth0();
    const [jwt, setJwt] = useState();
    const [title, setTitle] = useState(TITLE_SHE);
    const history = useHistory();


    useEffect(() => {
        if (isAuthenticated) {
            history.replace("/signup");
            return;
        }else{
            return
        }
    }, [isAuthenticated]);

    useEffect(() => {
      const random = Math.random() >= 0.5;
      if (random) {
        setTitle(TITLE_HE);
      } else {
        setTitle(TITLE_SHE);
      }
    }, []);

    if (loading) {
        return ( <div className="signup-page flex h-screen"> <LoadingSpinner /> </div>)

    }else {
        return(
            <div className="home-page h-screen">
                <div className="container flex">
                    <div className="carrotImg">
                        <img src="/felden-werner-hero-v1.png" />
                    </div>
                    <div className="headlineContainer">
                        <div>
                            <h1>Werde {title}</h1>
                            <h1>vom <span className="green">Erdbeerfeld</span></h1>

                        </div>
                        <div className="flex" style={{marginTop: "5%"}}>
                            <div style={{marginRight: "5%"}} >
                            <p className="label">Für Jobsuchende</p>
                                <button className="bg-green-400 rounded px-2 py-2 hover:bg-green-700 cursor-pointer cta"
                                onClick={() => {
                                    loginWithRedirect()
                                }}
                                >
                                    Jetzt Feldheld werden
                                </button>
                            </div>
                            <div>
                                <p className="label">Für Landwirte</p>
                                <button className="bg-green-400 rounded px-2 py-2 hover:bg-green-700 cursor-pointer cta cta-light-green"
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
