'use strict';
const Sequelize = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, dataType) => {
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
      type: dataType.STRING,
      allowNull: false,
      validate: {
        notNull: {

          msg: 'Please enter a valid title name'
        }
      }} ,
    author: {
      type: dataType.STRING,
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
  }, {sequelize});
  return Book;
};