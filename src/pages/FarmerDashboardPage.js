import React, { useState, useEffect } from 'react';
import Helmet from "react-helmet";
import AlgoliaPlaces from 'algolia-places-react';
import LocationPicker from 'react-location-picker';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";
import {useInput} from '../hooks/input-hook';
import {JobPosting} from "../components/FarmerJobPostingOverview";
import {LoadingSpinner} from "../components/Loading";

const placesApplicationId = 'plTW2AVBFZMV';
const placesSearchKey = '03ea77d80f7a79bdebe603f212de899e';

const FarmerDashboardPage = () => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [jwt, setJwt] = useState();
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const loadJobPostings = (jwt) => {
    api.listFarmerJobPostings(jwt)
      .then((res) => {
          setJobPostings(res.currentUser.ownedJobPostings.data)
          setIsLoading(false);
      }).catch((error)=>{
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!jwt) {
      return;
    }
    loadJobPostings();
  }, [jwt]);

  const reloadApplications =() => {
      setIsLoading(true);
      api.listFarmerJobPostings(jwt)
          .then((res) => {
              setJobPostings(res.currentUser.ownedJobPostings.data);
              setIsLoading(false);
          }).catch((error)=>{
          setIsLoading(false);
      });;
  };

  return (
    <div className="mx-auto">
      <ShowOrCreateJobPosting
        jobPostings={jobPostings}
        jwt={jwt}
        reloadApplications={reloadApplications}
        isLoading={isLoading}
        onJobPostingCreated={() => loadJobPostings(jwt)}
      />
    </div>
  );
};

const ShowOrCreateJobPosting = ({jobPostings,jwt,reloadApplications, isLoading, onJobPostingCreated}) => {
  const hasJobPosting = jobPostings.length > 0;
  if(isLoading){
      return ( <div className="flex h-screen"> <LoadingSpinner /> </div>)
  }

  if (hasJobPosting) {
    const jobPosting = jobPostings[0];
    return (
      <JobPosting jobPosting={jobPosting} jwt={jwt} reloadData={reloadApplications} />
    );
  } else {
    return (
      <CreateJobPostingForm jwt={jwt} onJobPostingCreated={onJobPostingCreated}/>
    )
  }
}




const JobDetailForm = ({ i, jobDetail, onChangeJobDetail }) => {
  const {value: position, bind: bindPosition} = useInput(jobDetail.positionNeeded);
  const {value: amount, bind: bindAmount} = useInput(jobDetail.amountNeeded);
  console.log('position', position);

  useEffect(() => {
    onChangeJobDetail(i, {
      positionNeeded: position,
      amountNeeded: amount,
    });
  }, [position, amount]);

  const positionId = `detail-${i}-position`;
  const amountId = `detail-${i}-amount`;
  return (
    <div className="w-full px-3 mb-6 md:mb-0">
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

const CreateJobPostingForm = ({ jwt, onJobPostingCreated }) => {
  const defaultPosition = {
    lat: 51.10,
    lng: 10.20,
  };
  const emptyJobDetail = { positionNeeded: '', amountNeeded: 10 };

  const [error, setError] = useState('');
  const [jobDetails, setJobDetails] = useState([]);
  const [mapPosition, setMapPosition] = useState(defaultPosition);
  const [algoliaPlaces, setAlgoliaPlaces] = useState();
  const [address, setAddress] = useState('');
  const {value: title, bind: bindTitle} = useInput('');
  const {value: description, bind: bindDescription} = useInput('');
  const {value: institution, bind: bindInstitution} = useInput('');

  const handleSubmit = (evt) => {
      evt.preventDefault();
      setError(undefined);
      const content = {
        jobPosting: {
          title,
          description,
        },
        jobContact: {
          lat: mapPosition.lat,
          lon: mapPosition.lng,
          address,
          institution
        },
        jobDetails,
      }

      api.postJobPosting(jwt,content).then((responseData)=> {
          console.log("Job posting erstellt");
          onJobPostingCreated();
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
    console.log('newJobDetails', newJobDetails);
    setJobDetails(newJobDetails);
  };

  const handleLocationChange = (newLocation) => {
    setMapPosition(newLocation.position);
    setAddress(newLocation.address);
  }

  const handleRefAlgoliaPlaces = (ref) => {
    setAlgoliaPlaces(ref);
  }

  const handleAlgoliaPlacesChange = (e) => {
    setAddress(e.suggestion.value);
  }

  useEffect(() => {
    if (!algoliaPlaces) {
      return;
    }
    algoliaPlaces.setVal(address);
  }, [address])

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
                       htmlFor="institution">
                    Betrieb
                </label>
                <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="institution" type="text" placeholder="Spargelhof Schönewelt"
                    {...bindInstitution}
                />
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
                    id="description" type="text" placeholder="Aufgaben, Zeitraum, Unterkunft, etc."
                    {...bindDescription}
                />
            </div>
            <h3 className="text-2xl text-gray-700 my-2">Offene Positionen</h3>
            { jobDetails.map((jobDetail, i) => (
              <JobDetailForm i={i} jobDetail={jobDetail} onChangeJobDetail={handleChangeJobDetail}/>
            )) }
            <div className="w-full px-3 mb-6 md:mb-0">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 my-4 rounded" onClick={handleClickAddPosition}>
                  Position hinzufügen
                </button>
            </div>
            <h3 className="text-2xl text-gray-700 my-2">Ort</h3>
            <div className="mb-2"><label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Ausgewählte Adresse</label><span>{address}</span></div>
            <AlgoliaPlaces
              placeholder='Such deine Adresse!'
              options={{
                appId: placesApplicationId,
                apiKey: placesSearchKey,
                language: 'de',
                countries: ['de'],
                type: 'address',
              }}
              placesRef={handleRefAlgoliaPlaces}
              onChange={handleAlgoliaPlacesChange}
            />
              <LocationPicker
                containerElement={ <div style={ {height: '100%'} } /> }
                mapElement={ <div style={ {height: '400px'} } /> }
                defaultPosition={defaultPosition}
                onChange={handleLocationChange}
                zoom={5}
              />
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
