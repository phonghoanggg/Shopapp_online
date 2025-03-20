'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.belongsTo(models.brands,{
        foreignKey:"brand_id"
      })
      products.belongsTo(models.categories,{
        foreignKey:"category_id"
      })
      products.belongsTo(models.categories,{
        foreignKey:"category_id"
      }),
      products.hasMany(models.order_details,{
        foreignKey:"product_id"
      })
      products.hasMany(models.banner_details,{
        foreignKey:"product_id"
      })
      products.hasMany(models.feed_backs,{
        foreignKey:"product_id"
      })
      products.hasMany(models.news_details,{
        foreignKey:"product_id"
      })
    }
  }
  products.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    oldprice: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    description: DataTypes.TEXT,
    specification: DataTypes.TEXT,
    buyturn: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
    tableName: 'products'
  });
  return products;
};