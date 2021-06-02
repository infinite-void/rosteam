'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      email: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      college: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      dept: {
        type: Sequelize.STRING
      },
      pwdhash: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      vsalt: {
        type: Sequelize.STRING
      },
      score: {
        type: Sequelize.INTEGER
      },
      lastanswer: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Users');
  }
};