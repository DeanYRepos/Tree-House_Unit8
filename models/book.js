'use strict';
const Sequelize = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: {  
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {

          msg: 'Please enter a valid title name'
        }
      }} ,
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {

          msg: 'Please enter a valid author name'
        }
      }
     },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER, 
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};