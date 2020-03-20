import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';

const MainPage = () => {
  const [viewer, setViewer] = useState({});

  useEffect(() => {
    async function fetchData() {
      fetch("/api/planets/4/")
        .then(res => console.log("res", res) || res.json())
        .then(res => console.log("res2", res) || setViewer(res.viewer));
    }

    fetchData();
  });

  console.log("id", viewer._id);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {viewer._id}
        </div>
      </header>
    </div>
  );
};

const OtherPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
            Other
        </a>
      </header>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
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

        <Switch>
          <Route path="/other">
            <OtherPage />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
