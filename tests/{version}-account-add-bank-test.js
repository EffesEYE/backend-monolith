const testutils = require('./init');

const { axios, loginAsUser } = testutils;

describe('tests for /{version}/account/add-bank', () => {
  describe('tests for POST', () => {
    it('should respond 401 for "Unauthorized (absent / invalid access token)"', async () => {
      const response = await axios.post('/account/add-bank', {
        nuban: '0037514056',
        bankname: 'UBA'
      });

      expect(response.status).toEqual(401);
      expect(response).toSatisfyApiSpec();
    });

    it('should respond 201 for "Created (account added)"', async () => {
      await loginAsUser();
      const response = await axios.post('/account/add-bank', {
        nuban: '0037514058',
        bankname: 'UBA'
      });

      expect(response.status).toEqual(201);
      expect(response).toSatisfyApiSpec();
    });
  });
});
