'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    id: DataTypes.UUID,
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    college: DataTypes.STRING,
    year: DataTypes.INTEGER,
    dept: DataTypes.STRING,
    pwdhash: DataTypes.STRING,
    salt: DataTypes.STRING,
    vsalt: DataTypes.STRING,
    score: DataTypes.INTEGER,
    lastanswer: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};