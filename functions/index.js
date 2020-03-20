import { GraphQLClient } from 'graphql-request';

const handleApiRequest = async () => {
  const endpoint = 'https://graphql.fauna.com/graphql'
  const token = FAUNADB_SECRET; // Via `wranger secret`

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

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
};

export {handleApiRequest};
