import React, { useState, useEffect } from 'react';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";
import {JobsCard} from "../components/JobCard";
import {ApplicationCard} from "../components/ApplicationCard";
import {LoadingSpinner} from "../components/Loading";

const ApplicationDashboardPage = () => {
    const { isAuthenticated, getIdTokenClaims } = useAuth0();
    const [jwt, setJwt] = useState();
    const [secrets, setSecrets] = useState({});
    const [openApplications, setOpenApplications] = useState([]);
    const [declinedApplications, setDeclinedApplications] = useState([]);
    const [acceptedApplications, setAcceptedApplications] = useState([]);

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

                    const data = applicationsResponse.currentUser.ownedJobApplications.data;
                    const _openApplications = data.filter((job)=>{ return (job.status ==="APPLIED")});
                    const _declinedApplications = data.filter((job)=>{return (job.status ==="DECLINED")});
                    const _acceptedApplications = data.filter((job)=>{return (job.status ==="ACCEPTED")});

                    setOpenApplications(_openApplications);
                    setDeclinedApplications(_declinedApplications);
                    setAcceptedApplications(_acceptedApplications)
                }
            }
        );
    }, [isAuthenticated, jwt]);

    const applicationsOverview = <div className="mt-10">
        {acceptedApplications.length>0 && ( <div className="mt-10">
            <h1 className="text-2xl my-10">Deine Jobs ({acceptedApplications.length})</h1>
            <div className="flex flex-wrap flex-row">
                {acceptedApplications && acceptedApplications.map(application=>{
                    return (<ApplicationCard {...application} key={application._id} />)
                })}
            </div>
        </div>)}

        {openApplications.length>0 && (<div>
            <h1 className="text-2xl">Deine offenen Bewerbungen ({openApplications.length})</h1>
            <div className="flex flex-wrap flex-row">
                {openApplications && openApplications.map(application=>{
                    return (<ApplicationCard {...application} key={application._id} />)
                })}
            </div>
        </div>)}

        {declinedApplications.length>0 && ( <div>
            <h1 className="text-2xl">Deine abgelehnten Bewerbungen</h1>
            <div className="flex flex-wrap flex-row">
                {declinedApplications && declinedApplications.map(application=>{
                    return (<ApplicationCard {...application} key={application._id} />)
                })}
            </div>
        </div>)}
    </div>

    return (
        <div className="my-10 ml-10">
            <h1 className="text-2xl ">Deine Bewerbungen auf einen Blick</h1>
            <div className="mt-5 pr-10">Finde hier einen Überblick über alle deine Bewerbungen! Bitte denke daran, dass ein Landwirt nicht alle Feldhelden aktzeptieren kann. Nachdem er deine Bewerbung bekommen und akzeptiert hat wird der Landwirt dich per Email oder Telefon kontaktieren.</div>

            {openApplications.length >0 ? applicationsOverview : (
                <div className="flex h-screen -mt-200">
                    <LoadingSpinner />
                </div>
                )}
        </div>
    );
};

export default ApplicationDashboardPage;
