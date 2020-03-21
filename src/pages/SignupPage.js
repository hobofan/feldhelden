import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import * as api from '../api';
import { useAuth0 } from "../react-auth0-spa";

const SignupPage = () => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [jwt, setJwt] = useState();
  const [secrets, setSecrets] = useState({});
  const history = useHistory();

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
    api.fetchCurrentUser(jwt).then((currentUser) => {
      if (currentUser?.currentUser?._id) {
        history.replace("/userdashboard");
      }
    });
  }, [jwt]);

  if (!isAuthenticated) {
    return <div></div>;
  }

  return (
    <div className="signup-page">
      <p>
        Dieser User muss sein Profil noch anlegen
      </p>
    </div>
  );
};

export default SignupPage;
