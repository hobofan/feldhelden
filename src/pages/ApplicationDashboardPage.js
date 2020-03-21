import React, { useState, useEffect } from 'react';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";
import {JobsCard} from "../components/JobCard";

const ApplicationDashboardPage = () => {
    const { isAuthenticated, getIdTokenClaims } = useAuth0();
    const [jwt, setJwt] = useState();
    const [secrets, setSecrets] = useState({});

    const [applications, setApplications] = useState([])

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
               console.log(applicationsResponse)
            }
        );
    }, [isAuthenticated, jwt]);
    console.log(jobs);
    return (
        <div className="">
            <h1 className="text-2xl my-10">Offene Jobs für Feldenhelden</h1>
            <div className="flex flex-wrap flex-row">
                {jobs && jobs.map(job=>{
                    return (<JobsCard {...job} key={job._id}/>)
                })
                }
            </div>
        </div>
    );
};

export default UserDashboardPage;
