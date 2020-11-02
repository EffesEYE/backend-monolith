const testutils = require('./init');

const { axios } = testutils;

describe('/{version}/register', () => {
  describe('tests for POST', () => {
    it('respond with 400 on invalid registration / "Bad Request"', async () => {
      const response = await axios.post('/register', {
        bvn: '12345678901',
        email: 'chaluwa@gmail.com'
      });

      expect(response.status).toEqual(400);
      expect(response).toSatisfyApiSpec();
    });

    it('respond with 201 & valid schema on "Created"', async () => {
      const response = await axios.post('/register', {
        bvn: '12345678901',
        pswd: 'pa55W0rd',
        email: 'chaluwa@gmail.com'
      });

      expect(response.status).toEqual(201);
      expect(response).toSatisfyApiSpec();
    });
  });
});
