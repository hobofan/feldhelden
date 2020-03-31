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
          <>
            <div className="bg-red-700 py-4 text-center text-white">
              <div>
                <a href="https://www.daslandhilft.de/">Großartige Neuigkeiten: Die Bundesregierung hat die Problematik erkannt und zwischenzeitlich ein großes Portal entwickelt: Lasst uns die Energie bündeln und besucht: www.daslandhilft.de - Vielen Dank für euren Support - Max, Alex & Specki</a>
              </div>
            </div>
            <div className="home-page bg-cover">
                <div className="hero-section pt-32 lg:pt-32 h-screen container flex flex-col md:flex-row">
                    <div className="carrotImg w-full md:w-1/4 items-start">
                        <img src="/felden-werner-hero-v1.png"/>
                    </div>
                    <div className="headlineContainer flex flex-col w-full md:flex md:w-3/4 lg:pt-8">
                        <div>
                            <h1>Werde {title}</h1>
                            <h1>vom <span className="text-color-green">Erdbeerfeld</span></h1>

                        </div>
                        <div className="md:flex mt-8">
                            <div className="lg:mr-8">
                                <p className="label">Für Jobsuchende</p>
                                    <button className="bg-green-400 rounded px-2 py-2 hover:bg-green-700 cursor-pointer cta"
                                    onClick={() => {
                                        loginWithRedirect({ landhelden_login_hint: 'signUp' })
                                    }}
                                    >
                                        Jetzt Feldheld werden
                                    </button>
                            </div>
                            <div>
                                <p className="label">Für Landwirte</p>
                                <button className="bg-green-400 rounded px-2 py-2 hover:bg-green-700 cursor-pointer cta cta-light-green"
                                onClick={() => {
                                    loginWithRedirect({ landhelden_login_hint: 'signUp' })
                                }}
                                >
                                    Jobs kostenlos eintragen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ backgroundColor: '#6defec' }} className="info-section text-color-earth text-center">
                  <h3 className="text-2xl pt-8 mb-2">Erklärvideo</h3>
                  <div className="text-center">
                    <iframe className="mx-auto w-full md:w-1/2" width="560" height="380" src="https://www.youtube.com/embed/2V5X88i0OeY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                  <p className="py-2 text-xl">
                    Dieses Projekt wurde im Rahmen des <a href="https://wirvsvirushackathon.org/" className="underline">WirvsVirus Hackathon</a> kreiert.
                  </p>
                  <p className="py-2 text-xl">
                    Der komplette Quellcode is open source und frei zugänglich auf <a href="https://github.com/hobofan/feldhelden" className="underline">GitHub</a> verfügbar.
                  </p>
                </div>
            </div>
          </>
        )

    }
};

export default IndexPage;
