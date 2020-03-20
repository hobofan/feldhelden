const getApiBase = () => {
  let apiBase = "/";
  if (window.location.hostname === "localhost") {
    apiBase = "https://feldhelden.org/";
  }

  return apiBase;
}

const fetchViewer = async () => {
  const apiBase = getApiBase();

  return await fetch(`${apiBase}api/planets/4/`)
    .then(res => res.json())
    .then(res => res.viewer);
}

export { fetchViewer };
