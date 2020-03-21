// Get Url base for redirects
// Should be based on window.location, so we don't send people to live environment after login.
const getUrlBaseRedirects = () => {
  return window.location.origin;
};

// Get URL base for issued requests.
// Has to point to a environment that can handle api routes (= not local dev)
const getUrlBase = () => {
  // let apiBase = "/";
  // if (window.location.hostname === "localhost") {
    // apiBase = "https://feldhelden.org/";
  // }
  const apiBase = "https://feldhelden.org/";

  return apiBase;
}

const getApiBase = () => {
  return getUrlBase();
}

const authHeader = (jwt) => {
  return `Bearer ${jwt}`;
}

const fetchViewer = async () => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/planets/4/`)
    .then(res => res.json())
    .then(res => res.viewer);
}

const fetchSecrets = async (jwt) => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/secrets`, {
    headers: {
      Authorization: authHeader(jwt),
    }
  })
    .then(res => res.json())
    .then(res => res);
}

const fetchCurrentUser = async (jwt) => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/currentuser`, {
    headers: {
      Authorization: authHeader(jwt),
    }
  })
    .then(res => res.json())
    .then(res => res);
}

const listFarmerJobPostings = async (jwt) => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/me/farmer/jobpostings`, {
    headers: {
      Authorization: authHeader(jwt),
    }
  })
    .then(res => res.json());
}

const listJobPostings = async (jwt) => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/jobpostings`, {
    headers: {
      Authorization: authHeader(jwt),
    }
  })
      .then(res => res.json());
}

const postUserDetails = async  (jwt,userDetails) => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/signup`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(jwt),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userDetails)
  })
      .then(res => res.json())
      .then(res => res);
}

const postJobPosting = async  (jwt,content) => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/me/farmer/createjobposting`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(jwt),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content)
  })
      .then(res => res.json())
      .then(res => res);
}

const postJobApplication = async  (jwt,content) => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}pi/me/helper/jobapplication`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(jwt),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content)
  })
      .then(res => res.json())
      .then(res => res);
}

export {
  fetchViewer,
  fetchSecrets,
  fetchCurrentUser,
  listFarmerJobPostings,
  getUrlBase,
  getUrlBaseRedirects,
  postUserDetails,
  postJobPosting,
  listJobPostings,
  postJobApplication
};
