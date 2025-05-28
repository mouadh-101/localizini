import Sequelize from 'sequelize';
import dbConfig from '../config/database.js';
import UserModel from './User.js';
import PlaceModel from './Place.js';
import CommentModel from './Comment.js'; // Import Comment model

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Initialize models
db.User = UserModel(sequelize);
db.Place = PlaceModel(sequelize);
db.Comment = CommentModel(sequelize); // Initialize Comment model

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
