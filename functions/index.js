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
  } else if (routeUrl.startsWith('/api/me/farmer/jobpostings')) {
    return await handleListFarmerJobPostings(request);
  } else if (routeUrl.startsWith('/api/jobpostings')){
    return await handleListJobPostings(request)
  } else if (routeUrl.startsWith('/api/me/farmer/createjobposting')) {
    return await handleCreateFarmerJobPostings(request);
  } else {
    return null;
  }
};

const getFaunaUserIdFromJwt = async (jwt) => {
  const graphQLClient = makeGQLClient();
  const auth0UserId = jwt.payload.sub;
  const query = /* GraphQL */ `
    {
      currentUser(auth0Id: "${auth0UserId}") {
        _id
      }
    }
  `;

  const data = await graphQLClient.request(query);
  return data.currentUser._id;
}

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

  const query = `
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

const handleListFarmerJobPostings = async (request) => {
  const graphQLClient = makeGQLClient();
  if (!request.jwt) {
    return null;
  }
  const auth0UserId = request.jwt.payload.sub;

  const query = `
    query FarmerJobPostings($auth0Id: String!) {
      currentUser(auth0Id: $auth0Id) {
        ownedJobPostings {
          data {
            title
          }
        }
      }
    }
  `
  const variables = { auth0Id: auth0UserId };
  const data = await graphQLClient.request(query, variables);
  return data
}

const handleListJobPostings = async (request) => {
  const graphQLClient = makeGQLClient();
  if (!request.jwt) {
    return null;
  }

  const query = `
     query jobs {
      jobs{   
        data {
        _id
        description
        title
        jobContact {
              _id
             lat
             lon
             street
             streetNumber
             zipCode
             city 
        }
        jobOwner {
            firstName
            lastName
            email
        }
        jobDetails {
          data{
            _id
            amountNeeded
            positionNeeded
          }
        }
      }
    }
   }
  `

  const data = await graphQLClient.request(query);
  return data
}


const handleCreateFarmerJobPostings = async (request) => {
  const graphQLClient = makeGQLClient();
  if (!request.jwt) {
    return null;
  }
  const bodyText = await request.text();
  const body =  JSON.parse(bodyText);
  const userId = await getFaunaUserIdFromJwt(request.jwt);

  const query = `
    mutation CreateJobPosting($data: JobPostingInput!){
      createJobPosting(data: $data) {
        _id
      }
    }
  `;

  const {jobPosting, jobContact, jobDetails} = body;
  jobPosting.jobOwner = { connect: userId };
  jobPosting.jobContact = { create: jobContact };
  jobPosting.jobDetails = { create: jobDetails };

  const variables = {
    data: jobPosting,
  };

  const data = await graphQLClient.request(query, variables);
  return data
};

export {handleApiRequest};
