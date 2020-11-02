const testutils = require('./init');

const { axios, loginAsUser, logout } = testutils;

describe('tests for /{version}/pay/airtime', () => {
  describe('tests for POST', () => {
    it('should respond 401 for "Unauthorized (absent / invalid access token)"', async () => {
      await logout();
      const response = await axios.post('/pay/airtime', {
        amount: 750,
        currency: 'NGN',
        provider: 'airtel',
        sendTo: '+2348138145472',
        accountToDebit: '0037514056'
      });

      expect(response.status).toEqual(401);
      expect(response).toSatisfyApiSpec();
    });

    it('should respond 201 for "Created (payment successful)"', async () => {
      await loginAsUser();
      const response = await axios.post('/pay/airtime', {
        amount: 750,
        currency: 'NGN',
        provider: 'airtel',
        sendTo: '+2348138145472',
        accountToDebit: '0037514056'
      });

      expect(response.status).toEqual(201);
      expect(response).toSatisfyApiSpec();
    });
  });
});
