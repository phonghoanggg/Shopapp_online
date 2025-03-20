'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedBack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      feedBack.belongsTo(models.products,{
        foreignKey:"product_id"
      })
      feedBack.belongsTo(models.users,{
        foreignKey:"user_id"
      })
    }
  }
  feedBack.init({
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    start: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'feedBack',
  });
  return feedBack;
};