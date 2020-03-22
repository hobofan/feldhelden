import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Helmet from "react-helmet";

import * as api from './api';
import Header from './Header';
import FarmerDashboardPage from './pages/FarmerDashboardPage.js';
import ImpressumPage from './pages/ImpressumPage.js';
import IndexPage from './pages/IndexPage';
import OtherPage from './pages/OtherPage.js';
import SignupPage from './pages/SignupPage.js';
import UserDashboardPage from './pages/UserDashboardPage.js';
import { useAuth0, Auth0Provider } from "./react-auth0-spa";
import authConfig from "./auth_config.json";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";

import './App.css';
import ApplicationDashboardPage from "./pages/ApplicationDashboardPage";

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

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
      </Helmet>
      <div>
        <Header/>
        <div>
          <Switch>
            <PrivateRoute path="/other">
              <OtherPage/>
            </PrivateRoute>
            <PrivateRoute path="/signup">
              <SignupPage/>
            </PrivateRoute>
            <PrivateRoute path="/userdashboard">
              <UserDashboardPage/>
            </PrivateRoute>
            <PrivateRoute path="/helper/applications">
              <ApplicationDashboardPage/>
            </PrivateRoute>
            <PrivateRoute path="/farmerdashboard">
              <FarmerDashboardPage />
            </PrivateRoute>
            <Route path="/impressum">
              <ImpressumPage/>
            </Route>
            <Route path="/">
              <IndexPage/>
            </Route>
          </Switch>
        </div>
      </div>
    </LogicWrapper>
  );
};

export default App;
