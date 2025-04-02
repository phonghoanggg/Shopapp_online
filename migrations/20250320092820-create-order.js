'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model:'users',
          key:'id'
        }
      },
      session_id: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.TEXT
      },
      total: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};