import React, { useState, useEffect } from 'react';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";

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
        setJobs
    );
  }, [isAuthenticated, jwt]);


  return (
    <div className="signup-page">
      <h4>Offene Jobs für Feldenhelden</h4>
      {JSON.stringify(jobs)}
    </div>
  );
};

export default UserDashboardPage;
