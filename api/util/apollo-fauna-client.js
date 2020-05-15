const dotenv = require('dotenv');
dotenv.config();

const { ApolloClient } = require('apollo-client');
const fetch = require('node-fetch');
const { HttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.FAUNADB_URL,
    fetch,
    headers: {
      authorization: `Bearer ${process.env.FAUNADB_KEY}`,
    },
  }),
  cache: new InMemoryCache({
    dataIdFromObject: (object) => object.ref || null,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

module.exports = client;
