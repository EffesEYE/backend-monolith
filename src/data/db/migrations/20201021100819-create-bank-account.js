module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bankaccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nuban: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^[0-9]{11}$/i
        }
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: false
      },
      owner: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          as: 'owner',
          model: 'users'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bankaccounts');
  }
};
