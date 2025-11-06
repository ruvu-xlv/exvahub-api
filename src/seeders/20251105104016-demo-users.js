'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Super Admin',
        username: 'superadmin',
        email: 'superadmin@exvahub.com', // ← EMAIL UNIK
        password: hashedPassword,
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'System Admin',
        username: 'sysadmin', // ← USERNAME UNIK
        email: 'admin@exvahub.com',
        password: hashedPassword,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Content Editor',
        username: 'editor',
        email: 'editor@exvahub.com',
        password: hashedPassword,
        role_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Regular User',
        username: 'regularuser', // ← USERNAME UNIK
        email: 'user@exvahub.com',
        password: hashedPassword,
        role_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};