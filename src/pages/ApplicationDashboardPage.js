import React, { useState, useEffect } from 'react';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";
import {JobsCard} from "../components/JobCard";

const ApplicationDashboardPage = () => {
    const { isAuthenticated, getIdTokenClaims } = useAuth0();
    const [jwt, setJwt] = useState();
    const [secrets, setSecrets] = useState({});

    const [openApplications, setOpenApplications] = useState([])

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
        api.fetchSecrets(jwt).then(setSecrets);
    }, [jwt]);

    useEffect(() => {
        if (!jwt) {
            return;
        }
        api.listJobApplicationsHelper(jwt).then(
            applicationsResponse => {
                if (applicationsResponse && applicationsResponse.currentUser &&  applicationsResponse.currentUser.ownedJobApplications.data){
                    setOpenApplications(applicationsResponse.currentUser.ownedJobApplications.data)
                    console.log(openApplications)
                }
            }
        );
    }, [isAuthenticated, jwt]);

    return (
        <div className="">
            <h1 className="text-2xl my-10 ml-10">Deine Jobs</h1>
                <div className="flex flex-wrap flex-row">

                </div>
        </div>
    );
};

export default ApplicationDashboardPage;
