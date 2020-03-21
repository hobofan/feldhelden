import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Helmet from "react-helmet";

import * as api from './api';
import IndexPage from './pages/IndexPage';
import OtherPage from './pages/OtherPage.js';
import SignupPage from './pages/SignupPage.js';
import UserDashboardPage from './pages/UserDashboardPage.js';
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
            <button onClick={() => loginWithRedirect({
              redirect_uri: `${api.getUrlBase()}signup`
            })}>Log in</button>
          )}

          {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
        </li>
      </ul>
    </nav>
  );
}

const LogicWrapper = ({ children }) => {
  return (
    <Auth0Provider
      domain={authConfig.domain}
      client_id={authConfig.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <Router>
        {children}
      </Router>
    </Auth0Provider>
  );
};


const App = () => {
  return (
    <LogicWrapper>
      <Helmet>
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
      </Helmet>
      <div>
        <Header/>
        <Switch>
          <PrivateRoute path="/other">
            <OtherPage />
          </PrivateRoute>
          <PrivateRoute path="/signup">
            <SignupPage />
          </PrivateRoute>
          <PrivateRoute path="/userdashboard">
            <UserDashboardPage />
          </PrivateRoute>
          <Route path="/">
            <IndexPage />
          </Route>
        </Switch>
      </div>
    </LogicWrapper>
  );
};

export default App;
