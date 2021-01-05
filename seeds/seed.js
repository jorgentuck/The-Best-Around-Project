const sequelize = require('../config/connection');
const {
    Designs,
    Favorites,
    Instructions,
    Users,
    Videos,
    Votes,
  } = require('../models');


const designsData = require('./designsData.json');
const favoritesData = require('./favoritesData.json');
const instructionsData = require('./instructionsData.json');
const usersData = require('./usersData.json');
const videosData = require('./videosData.json');
const votesData = require('./votesData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
  
    await Users.bulkCreate(usersData, {
      individualHooks: true,
      returning: true,
    });
  
    await Designs.bulkCreate(designsData, {
      individualHooks: true,
      returning: true,
    });
  
    await Favorites.bulkCreate(favoritesData, {
      individualHooks: true,
      returning: true,
    });
  
    await Instructions.bulkCreate(instructionsData, {
      individualHooks: true,
      returning: true,
    });
  
    await Videos.bulkCreate(videosData, {
      individualHooks: true,
      returning: true,
    });
  
    await Votes.bulkCreate(votesData, {
      individualHooks: true,
      returning: true,
    });
  
    process.exit(0);
  };
  
  seedDatabase();