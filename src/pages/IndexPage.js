import React, { useState, useEffect } from 'react';

import * as api from '../api';
import './IndexPage.css';

const IndexPage = () => {
  // const [viewer, setViewer] = useState({});

  // useEffect(() => {
    // api.fetchViewer().then((viewer) => {
      // setViewer(viewer);
    // });
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
};

export default IndexPage;
