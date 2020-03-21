import React, { useState, useEffect } from 'react';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";
import {JobsCard} from "../components/JobCard";

const UserDashboardPage = () => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [jwt, setJwt] = useState();
  const [secrets, setSecrets] = useState({});

  const [jobs, setJobs] = useState([])

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
    api.listJobPostings(jwt).then(
        jobsResponse => {
          jobsResponse.jobs && setJobs(jobsResponse.jobs.data)
        }
    );
  }, [isAuthenticated, jwt]);
  console.log(jobs)
  return (
    <div className="signup-page">
      <h1 className="text-2xl">Offene Jobs für Feldenhelden</h1>
      <div className="flex flex-wrap flex-row">
        {jobs && jobs.map(job=>{
          return (<JobsCard {...job} key={job.id}/>)
        })
        }
      </div>
    </div>
  );
};

export default UserDashboardPage;
