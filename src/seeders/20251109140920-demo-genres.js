'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Genres', [
      {
        name: 'Comedy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Action',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Game',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Horror',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fantasy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Blood',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Historical',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Romance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Reincaranation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Time Travel',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'School',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mystery',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Psychological',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Isekai',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Genres', null, {});
  }
};
