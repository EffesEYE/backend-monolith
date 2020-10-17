module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bvn: Sequelize.STRING(11),
      hashedpassword: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      accountid: {
        type: Sequelize.STRING,
        unique: true
      },
      accounttype: {
        type: Sequelize.ENUM('USER', 'ADMIN'),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        validate: { isEmail: true }
      },
      firstname: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      middlename: Sequelize.STRING(30),
      lastname: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(14),
        allowNull: false
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
    await queryInterface.dropTable('users');
  }
};
