import React, { useState, useEffect } from 'react';
import { GoogleMapsLoader, GeoSearch, Marker } from 'react-instantsearch-dom-maps';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";
import {JobsCard} from "../components/JobCard";

const applicationId = '2H0T9G39WY';
const searchKey = '5e2371c57dc5129d4969091cf8012a2a';
const indexName = 'feldhelden';
const searchClient = algoliasearch(applicationId, searchKey);

const defaultPosition = {
  lat: 51.10,
  lng: 10.20,
};

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

  const onClickMarker = (marker) => {
    console.log(marker);
  };

  return (
    <InstantSearch
      indexName={indexName}
      searchClient={searchClient}
    >
    <div className="">
      <h1 className="text-2xl">Offene Jobs für Feldenhelden</h1>
      <div className="flex w-full">
        <div className="flex flex-wrap flex-row w-1/2">
        {jobs && jobs.map(job=>{
          return (<JobsCard {...job} key={job._id}/>)
        })
        }
        </div>
        <div className="w-1/2">
          <GoogleMapsLoader apiKey="AIzaSyB9lVI5qfcBinEFzOpwgm3QDIYu0TquZPE">
            {google => (
              <GeoSearch google={google} initialZoom={8} initialPosition={defaultPosition}>
                {({ hits }) => (
                  <div>
                    {hits.map(hit => (
                      <Marker key={hit.objectID} hit={hit} onClick={onClickMarker}/>
                    ))}
                  </div>
                )}
              </GeoSearch>
            )}
          </GoogleMapsLoader>
        </div>
      </div>
    </div>
    </InstantSearch>
  );
};

export default UserDashboardPage;
