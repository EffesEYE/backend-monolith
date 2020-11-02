module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert(
      'bankaccounts',
      [
        {
          nuban: '9267409167',
          bank: 'GTB',
          owner: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          nuban: '0002674983',
          bank: 'UBA',
          owner: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          nuban: '8271670083',
          bank: 'Zenith',
          owner: 1,
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
    await queryInterface.bulkDelete('bankaccounts', null, {});
  }
};
