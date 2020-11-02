'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert(
      'payments',
      [
        {
          amount: 1000,
          currency: 'NGN',
          tnxtype: 'AIRTIME',
          status: 'SUCCEEDED',
          user: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          amount: 5000,
          currency: 'NGN',
          tnxtype: 'PAYTV',
          status: 'SUCCEEDED',
          user: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          amount: 12000,
          currency: 'NGN',
          tnxtype: 'ELECTRICITY',
          status: 'SUCCEEDED',
          user: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('payments', null, {});
  }
};
