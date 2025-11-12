'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Episodes', [
      {
        title: 'Arch 12',
        movie_id: '3',
        episode_number: '5',
        video_url: 'https://panan.com/kkkkk',
        duration: '689',
        source_type: 'upload',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Arch 4',
        movie_id: '2',
        episode_number: '8',
        video_url: 'https://panan.com/sjaknx',
        duration: '6999',
        source_type: 'upload',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
   
    await queryInterface.bulkDelete('Episodes', null, {});
  }
};
