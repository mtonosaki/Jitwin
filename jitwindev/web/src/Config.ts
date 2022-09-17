const isDevelopment = () =>
  process.env.REACT_APP_NODE_ENV === undefined ||
  process.env.REACT_APP_NODE_ENV === 'development';

const loginUrl = () =>
  isDevelopment()
    ? 'http://localhost:8080/oauth2/authorization/graph'
    : '/oauth2/authorization/graph';

export const Config = {
  isDevelopment,
  loginUrl,
};
