import { GraphQLClient } from 'graphql-request';

const makeGQLClient = () => {
  const endpoint = 'https://graphql.fauna.com/graphql'
  const token = FAUNADB_SECRET; // Via `wranger secret`

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return graphQLClient;
}

const handleApiRequest = async (request) => {
  const url = new URL(request.url);
  const routeUrl = url.pathname;

  if (routeUrl.startsWith('/api/secrets')) {
    return {
      secrets: 'my preciousssss',
      jwt: request.jwt,
    };
  } else {
    return await handleFetchViewer();
  }

};

const handleFetchViewer = async () => {
  const graphQLClient = makeGQLClient();

  const query = /* GraphQL */ `
    {
      viewer {
        _id
        firstName
        lastName
      }
    }
  `

  const data = await graphQLClient.request(query)

  return data;
}

export {handleApiRequest};
