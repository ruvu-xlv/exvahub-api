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
    await queryInterface.bulkInsert('Movies', [
      {
        title: 'Throne Of Sheal',
        description: 'Throne Of Sheal Throne Of Sheal Throne Of Sheal Throne Of Sheal',
        year: '2005',
        genre_id: '2',
        thumbnail: 'hdksahdjasbschajscsajcjab.png',
        type: 'series',
        created_by: '1',
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Renegade Immortal',
        description: 'Renegade Immortal Renegade Immortal Renegade Immortal Renegade Immortal Renegade Immortal Renegade Immortal',
        year: '2024',
        genre_id: '5',
        thumbnail: 'lsdjfhkdjcnksdjbcasdcbhdcsh.png',
        type: 'series',
        created_by: '3',
        status: 'published',
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
    await queryInterface.bulkDelete('Movies', null, {});
  }
};
