const getApiBase = () => {
  let apiBase = "/";
  if (window.location.hostname === "localhost") {
    apiBase = "https://feldhelden.org/";
  }

  return apiBase;
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

export { fetchViewer, fetchSecrets };
