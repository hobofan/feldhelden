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

const JobDetailForm = ({ key , jobDetail, onChangeJobDetail }) => {
  const {value: position, bind: bindPosition} = useInput(jobDetail.positionNeeded);
  const {value: amount, bind: bindAmount} = useInput(jobDetail.amountNeeded);

  useEffect(() => {
    onChangeJobDetail(key, {
      positionNeeded: position,
      amountNeeded: amount,
    });
  }, [position, amount]);

  const positionId = `detail-${key}-position`;
  const amountId = `detail-${key}-amount`;
  return (
    <div key={key} className="w-full px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
               htmlFor={amountId}>
            Anzahl
        </label>
        <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id={amountId} type="number"
            {...bindAmount}
        />
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
               htmlFor={positionId}>
            Position
        </label>
        <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id={positionId} type="text" placeholder="Spargelpflücker"
            {...bindPosition}
        />
    </div>
  );
};

const CreateJobPostingForm = ({ jwt }) => {
  const emptyJobDetail = { positionNeeded: '', amountNeeded: 10 };

  const [error, setError] = useState('');
  const [jobDetails, setJobDetails] = useState([]);
  const {value: title, bind: bindTitle} = useInput('');
  const {value: description, bind: bindDescription} = useInput('');

  const handleSubmit = (evt) => {
      evt.preventDefault();
      setError(undefined);
      const content = {
        jobPosting: {
          title,
          description,
        },
        jobContact: {
          lat: 1, //TODO
          lon: 1, // TODO
          street: "Eine Strasse", // TODO
          streetNumber: "1", // TODO
          zipCode: "12435", // TODO
          city: "Nicht Berlin", // TODO
        },
        jobDetails,
      }

      api.postJobPosting(jwt,content).then((responseData)=> {
          console.log("Job posting erstellt");
      }).catch((test)=>{
          setError("Registrierung fehlgeschlagen bitte probiere es nochmal!");
      });
  };

  const handleClickAddPosition = (evt) => {
    evt.preventDefault();

    setJobDetails(jobDetails.concat(Object.assign({}, emptyJobDetail)));
  }

  const handleChangeJobDetail = (key, jobDetail) => {
    const newJobDetails = [...jobDetails];
    newJobDetails[key] = jobDetail;
    setJobDetails(newJobDetails);
  };

  return (
    <div>
      <form className="max-w-lg m-auto" onSubmit={handleSubmit}>

          {error && <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 bg-red-200 rounded  py-3 px-4">
                  {error}
              </div>
          </div>}

          <h2 className="text-4xl text-gray-700">Ausschreibung anfertigen</h2>

          <div className="my-4">
            <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                       htmlFor="title">
                    Überschrift
                </label>
                <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="title" type="text" placeholder="Spargelpflücken im Freien!"
                    {...bindTitle}
                />
            </div>
            <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                       htmlFor="description">
                    Beschreibung
                </label>
                <textarea
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="description" type="text" placeholder=""
                    {...bindDescription}
                />
            </div>
            <h3 className="text-2xl text-gray-700 my-2">Offene Positionen</h3>
            { jobDetails.map((jobDetail, i) => (
              <JobDetailForm key={i} jobDetail={jobDetail} onChangeJobDetail={handleChangeJobDetail}/>
            )) }
            <div className="w-full px-3 mb-6 md:mb-0">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 my-4 rounded" onClick={handleClickAddPosition}>
                  Position hinzufügen
                </button>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Ausschriebung veröffentlichen
                  </button>
              </div>
          </div>
      </form>
    </div>
  )
}

export default FarmerDashboardPage;
