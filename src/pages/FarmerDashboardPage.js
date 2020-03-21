import React, { useState, useEffect } from 'react';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";
import {useInput} from '../hooks/input-hook';

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
      <ShowOrCreateJobPosting jobPostings={jobPostings} jwt={jwt} />
    </div>
  );
};

const ShowOrCreateJobPosting = ({ jobPostings, jwt }) => {
  const hasJobPosting = jobPostings.length > 0;

  if (hasJobPosting) {
    const jobPosting = jobPostings[0];

    return (
      <div>
        <JobPosting jobPosting={jobPosting} />
      </div>
    );
  } else {
    return (
      <div>
        <CreateJobPostingForm jwt={jwt} />
      </div>
    )
  }
}

const JobPosting = ({ jobPosting }) => {
  return (
    <div>
      Deine bereits erstellter Ausscheibung: {jobPosting.title}
    </div>
  );
}

const CreateJobPostingForm = ({ jwt }) => {
  const [error, setError] = useState('');
  const {value: firstName, bind: bindFirstName} = useInput('');

  const handleSubmit = (evt) => {
      evt.preventDefault();
      setError(undefined);
      const content = {
        jobPosting: {
          title: "Some new job", // TODO
          description: "Some description", // TODO
        },
        jobContact: {
          lat: 1, //TODO
          lon: 1, // TODO
          street: "Eine Strasse", // TODO
          streetNumber: "1", // TODO
          zipCode: "12435", // TODO
          city: "Nicht Berlin", // TODO
        },
        jobDetails: [{
          positionNeeded: "Jäger", // TODO
          amountNeeded: 100, // TODO
        }],
      }

      api.postJobPosting(jwt,content).then((responseData)=> {
          console.log("Job posting erstellt");
      }).catch((test)=>{
          setError("Registrierung fehlgeschlagen bitte probiere es nochmal!");
      });

  };

  return (
    <div>
      <button onClick={handleSubmit}>Erstellen</button>
    </div>
  )
}

export default FarmerDashboardPage;
