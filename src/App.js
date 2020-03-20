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
import './App.css';

const Header = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/other">Other</Link>
        </li>
      </ul>
    </nav>
  );
}


const App = () => {
  return (
    <Router>
      <div>
        <Header/>
        <Switch>
          <Route path="/other">
            <OtherPage />
          </Route>
          <Route path="/">
            <IndexPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
