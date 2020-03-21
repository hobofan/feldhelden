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
    const history = useHistory();


    const {value: firstName, bind: bindFirstName, reset: resetFirstName} = useInput('');
    const {value: lastName, bind: bindLastName, reset: resetLastName} = useInput('');
    const {value: email, bind: bindEmail, reset: resetEmail, setValue: setEmail} = useInput('');
    const {value: phone, bind: bindPhone, reset: resetPhone} = useInput('');
    const {value: userType, bind: bindUserType, reset: resetUserType, setValue:setUserType} = useInput('');


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
        const authOid = user.sub;
        const userDetails = {
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            auth0Id: authOid,
            userType: userType
        }

        console.log(userDetails);

        api.postUserDetails(jwt,userDetails).then((responseData)=> {

            alert("Succesfully registered");

        }).catch((test)=>{

            setError("Registrierung fehlgeschlagen bitte probiere es nochmal!");

        });

    };


    if (!isAuthenticated) {
        return <div>Loading</div>;
    }

    if (!user){
        return <div>Loading</div>;
    }
    return (
        <div className="signup-page object-center">

            <form className="max-w-lg object-center" onSubmit={handleSubmit}>

                {error && <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3 bg-red-200 rounded  py-3 px-4">
                        {error}
                    </div>
                </div>}
                <div className="flex flex-wrap -mx-3 mb-6">
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
                               htmlFor="email">
                            Benutzertyp
                        </label>

                        <div className="inline-block relative w-64">
                            <select
                                className="block appearance-none w-full bg-gray-200 text-gray-700 border border-gray-200 rounded hover:border-gray-500 leading-tight py-3 px-4 mb-3 focus:outline-none focus:bg-white focus:border-gray-500"
                                {...bindUserType}
                            >
                                <option>HELPER</option>
                                <option>FARMER</option>
                            </select>
                            <div
                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 30">
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
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
};

export default SignupPage;
