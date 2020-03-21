import React, { useState, useEffect } from 'react';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";

const FarmerDashboardPage = () => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [jwt, setJwt] = useState();
  const [jobPostings, setJobPostings] = useState([]);

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
    api.listFarmerJobPostings(jwt)
      .then((res) => setJobPostings(res.currentUser.ownedJobPostings.data));
  }, [jwt]);

  console.log('secrets', jobPostings);

  return (
    <div className="signup-page">
      <ShowOrCreateJobPosting jobPostings={jobPostings} />
    </div>
  );
};

const ShowOrCreateJobPosting = ({ jobPostings }) => {
  const hasJobPosting = jobPostings.length > 0;

  if (hasJobPosting) {
    const jobPosting = jobPostings[0];

    return (
      <div>
        Deine bereits erstellter Ausstellung: {jobPosting.title}
      </div>
    );
  } else {
    return (
      <div>
        Lege einen neuen job an!
      </div>
    )
  }
}

const CreateJobPostingForm = ({ jwt }) => {

}

export default FarmerDashboardPage;
