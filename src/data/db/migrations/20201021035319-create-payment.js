module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      currency: {
        type: Sequelize.ENUM('NGN', 'USD'),
        allowNull: false
      },
      tnxtype: {
        type: Sequelize.ENUM('AIRTIME', 'ELECTRICITY', 'PAYTV'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'FAILED', 'SUCCEEDED'),
        allowNull: false
      },
      tnxdetails: Sequelize.TEXT,
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: 'id',
          as: 'userId',
          model: 'Users'
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
    await queryInterface.dropTable('payments');
  }
};
