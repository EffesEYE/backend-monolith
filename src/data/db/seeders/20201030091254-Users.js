'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert(
      'users',
      [
        {
          bvn: '12345678901',
          accountid: 'rythgldjfrig094745970497594',
          accounttype: 'USER',
          hashedpassword: '5793459436tvrfgsdihsdhkdshfksdhfk7897549353',
          email: 'lol@example.com',
          firstname: 'James',
          middlename: 'Baker',
          lastname: 'Bond',
          phone: '08167352983'
        }, {
          bvn: '23456789012',
          accountid: 'dhfdshtorytooutoueretertper',
          accounttype: 'USER',
          hashedpassword: '30482304-2355694759894532f-sdbfsdhkdshfk564',
          email: 'moi@example.com',
          firstname: 'Moi',
          middlename: 'Judith',
          lastname: 'Eze',
          phone: '08046828639'
        }, {
          bvn: '34567890123',
          accountid: 'gjlidsfhgi567045584843076674',
          accounttype: 'USER',
          hashedpassword: 'p3984538657493980ndfjhdskfhg487534498759345645',
          email: 'joi@example.com',
          firstname: 'Joi',
          middlename: 'Mordy',
          lastname: 'Ekene',
          phone: '09175849274'
        }

      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
