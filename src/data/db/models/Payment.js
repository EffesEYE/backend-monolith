const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }
  Payment.init(
    {
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      currency: {
        type: DataTypes.ENUM('NGN', 'USD'),
        allowNull: false
      },
      tnxtype: {
        type: DataTypes.ENUM('AIRTIME', 'ELECTRICITY', 'PAYTV'),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'FAILED', 'SUCCEEDED'),
        allowNull: false
      },
      tnxdetails: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue('tnxdetails'));
        },
        set(value) {
          return this.setDataValue('tnxdetails', JSON.stringify(value));
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Payment'
    }
  );
  return Payment;
};
