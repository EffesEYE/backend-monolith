const path = require('path');
const axios = require('axios');
const openapi = require('jest-openapi');

axios.defaults.baseURL = 'http://localhost:8181/2020-10';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.validateStatus = (status) => status >= 200 && status < 503;

openapi(path.join(__dirname, '../src/api-spec.yaml'));

const login = async (endpoint, { email, pswd }) => {
  const { data: { authToken } } = await axios.post(endpoint, {
    email,
    pswd
  });

  axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
};

const loginAsUser = async () => login('/auth/user-login', {
  email: 'lol@example.com',
  pswd: 'pa55W0rd'
});

const loginAsAdmin = async () => login('/auth/admin-login', {
  email: 'chaluwa@gmail.com',
  pswd: 'pa55W0rd'
});

const logout = async () => {
  axios.defaults.headers.common.Authorization = '';
};

module.exports = {
  axios, loginAsAdmin, loginAsUser, logout
};
