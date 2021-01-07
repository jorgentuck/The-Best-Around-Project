const Users = require('./Users');
const Designs = require('./Designs');
const Favorites = require('./Favorites');
const Votes = require('./Votes');
const Images = require('./Images');
const Instructions = require('./Instructions');
const Videos = require('./Videos');

Users.hasMany(Designs, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Users.hasMany(Favorites, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Users.hasMany(Votes, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Designs.hasMany(Favorites, {
    foreignKey: 'design_id',
    onDelete: 'CASCADE'
  });

Designs.hasMany(Votes, {
  foreignKey: 'design_id',
  onDelete: 'CASCADE'
});

Designs.hasMany(Images, {
    foreignKey: 'design_id',
    onDelete: 'CASCADE'
  });

Designs.hasMany(Instructions, {
  foreignKey: 'design_id',
  onDelete: 'CASCADE'
});

Designs.hasOne(Videos, {
  foreignKey: 'design_id',
  onDelete: 'CASCADE'
});

Designs.belongsTo(Users, {
  foreignKey: 'user_id'
});

Favorites.belongsTo(Users, {
  foreignKey: 'user_id'
});

Favorites.belongsTo(Designs, {
  foreignKey: 'design_id'
});

Votes.belongsTo(Users, {
  foreignKey: 'user_id'
});

Votes.belongsTo(Designs, {
  foreignKey: 'design_id'
});

Images.belongsTo(Designs, {
  foreignKey: 'design_id'
});

Instructions.belongsTo(Designs, {
  foreignKey: 'design_id'
});

Videos.belongsTo(Designs, {
  foreignKey: 'design_id'
});

module.exports = { Users, Designs, Favorites, Votes, Images, Instructions, Videos };