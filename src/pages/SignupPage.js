import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";

import * as api from '../api';
import {useAuth0} from "../react-auth0-spa";
import {useInput} from '../hooks/input-hook';



const SignupPage = () => {
    const {isAuthenticated, getIdTokenClaims,user} = useAuth0();
    const [jwt, setJwt] = useState();
    const [secrets, setSecrets] = useState({});
    const [error, setError] = useState('');
    const [userType, setUserType] = useState(undefined);
    const history = useHistory();


    const {value: firstName, bind: bindFirstName, reset: resetFirstName} = useInput('');
    const {value: lastName, bind: bindLastName, reset: resetLastName} = useInput('');
    const {value: email, bind: bindEmail, reset: resetEmail, setValue: setEmail} = useInput('');
    const {value: phone, bind: bindPhone, reset: resetPhone} = useInput('');

    const HELPER="HELPER";
    const FARMER="FARMER";

    const TYPE_TO_TEXT = {
        HELPER:"Feldheld",
        FARMER:"Landwirt"
    }

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
                if (currentUser.currentUser.userType === "FARMER") {
                  history.replace("/farmerdashboard");
                } else {
                  history.replace("/userdashboard");
                }
            }
        });
    }, [jwt]);


    const handleSubmit = (evt) => {
        evt.preventDefault();
        setError(undefined);
        const authOid = user.sub;
        const userDetails = {
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            auth0Id: authOid,
            userType: userType
        }

        api.postUserDetails(jwt,userDetails).then((responseData)=> {
            console.log(userDetails);
            if (userDetails.userType === "FARMER") {
                history.replace("/farmerdashboard");
            } else {
                history.replace("/userdashboard");
            }
        }).catch((test)=>{
            setError("Registrierung fehlgeschlagen bitte probiere es nochmal!");
        });

    };


    if (!isAuthenticated) {
        return <div className="signup-page object-center">Loading</div>;
    }

    if (!user){
        return <div className="signup-page object-center">Loading</div>;
    }


    if (!userType){
        return (
            <div className="signup-page flex h-screen">
                <div className="flex m-auto">
                    <div className="flex-1 text-gray-700 text-center px-4 py-2 m-2">
                        <div className="font-bold text-green-500">Für Jobsuchende</div>

                        <div className="bg-green-500 rounded shadow py-4 my-10 hover:bg-green-700 cursor-pointer "
                        onClick={ () => {setUserType(HELPER)}}>
                            Feldheld werden
                        </div>
                    </div>
                    <div className="flex-1 text-gray-700 text-center px-4 py-2 m-2"
                         onClick={ () => {setUserType(FARMER)}}>
                        <div className="font-bold text-green-400">Für Landwirte</div>

                        <div className="bg-green-400 rounded shadow py-4 my-10 hover:bg-green-700 cursor-pointer ">
                            Erntejobs kostenen los einstellen
                        </div>
                    </div>
                </div>
            </div>
        )

    } else {
        return (
            <div className="signup-page flex h-screen">

                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="text-sm cursor-pointer" onClick={ () => {setUserType(undefined)}}>
                        Zurück zur Auswahl
                    </div>
                </div>

                <form className="max-w-lg m-auto" onSubmit={handleSubmit}>

                    {error && <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3 bg-red-200 rounded  py-3 px-4">
                            {error}
                        </div>
                    </div>}



                    <h2 className="text-4xl text-gray-700">Anmeldung als {TYPE_TO_TEXT[userType]}</h2>

                    <div className="flex flex-wrap -mx-3 mb-6 my-4">

                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="first-name">
                                Vorname
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="first-name" type="text" placeholder="Sabine"
                                {...bindFirstName}
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="last-name">
                                Nachname
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="last-name" type="text" placeholder="Pietsch"
                                {...bindLastName}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="email">
                                Email
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="email" type="email" placeholder="sabine.pietsch@company.de"
                                {...bindEmail}/>
                            <p className="text-gray-600 text-xs italic">Bitte gebe eine valide Email Addresse ein</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                   htmlFor="phone">
                                Telefonnummer
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="email" type="text" placeholder="0176 00112233" {...bindPhone}/>
                            <p className="text-gray-600 text-xs italic">Bitte gib deine Telefonnumer ein</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Registrieren
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );

    }




};

export default SignupPage;
