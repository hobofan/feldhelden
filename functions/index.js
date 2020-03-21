import { GraphQLClient } from 'graphql-request';

const makeGQLClient = () => {
  const endpoint = 'https://graphql.fauna.com/graphql'
  const token = FAUNADB_SECRET; // Via `wrangler secret`

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
  } else if (routeUrl.startsWith('/api/currentuser')) {

    return await handleCurrentUser(request);
  } else if (routeUrl.startsWith('/api/signup')) {
    return await handleSignUpPost(request);
  } else {
    return await handleFetchViewer();
  }

};

const handleCurrentUser = async (request) => {
  const graphQLClient = makeGQLClient();
  if (!request.jwt) {
    return null;
  }
  const auth0UserId = request.jwt.payload.sub;

  const query = /* GraphQL */ `
    {
      currentUser(auth0Id: "${auth0UserId}") {
        _id
        userType
        firstName
        lastName
        email
        email
        phone
      }
    }
  `

  const data = await graphQLClient.request(query);

  return data;
}

const handleSignUpPost= async (request) => {
  const graphQLClient = makeGQLClient();
  if (!request.jwt) {
    return null;
  }
  const bodyText = await request.text();
  const body =  JSON.parse(bodyText);

  const query = /* GraphQL */ `
    mutation CreateUser($data: UserInput!){
      createUser(data: $data) {
        email
      }
    }
  `;

  const variables = {
    data: body,
  };

  const data = await graphQLClient.request(query, variables);

  return data
};

export {handleApiRequest};
