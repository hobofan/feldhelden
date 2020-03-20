import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import * as api from './api';
import IndexPage from './pages/IndexPage';
import OtherPage from './pages/OtherPage.js';
import { useAuth0, Auth0Provider } from "./react-auth0-spa";
import authConfig from "./auth_config.json";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";

import './App.css';

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/other">Other</Link>
        </li>
        <li>
          {!isAuthenticated && (
            <button onClick={() => loginWithRedirect({})}>Log in</button>
          )}

          {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
        </li>
      </ul>
    </nav>
  );
}


const App = () => {
  return (
    <Auth0Provider
      domain={authConfig.domain}
      client_id={authConfig.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
    <Router>
      <div>
        <Header/>
        <Switch>
          <PrivateRoute path="/other">
            <OtherPage />
          </PrivateRoute>
          <Route path="/">
            <IndexPage />
          </Route>
        </Switch>
      </div>
    </Router>
    </Auth0Provider>
  );
};

export default App;
