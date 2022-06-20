import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: "https://prompt-molly-87.hasura.app/v1/graphql",
  headers:{
    'x-hasura-admin-secret':'ul7dtQXMhnsj7ibTgL0BZkzxC4CxQrERB903Mug66XBW385LSY2uR9UDnVsrANby'
    },
  cache: new InMemoryCache()
});





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);


