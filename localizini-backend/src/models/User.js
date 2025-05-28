import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    // Helper method for defining associations.
    // This method is not a part of Sequelize lifecycle.
    // The `models/index` file will call this method automatically.
    static associate(models) {
      // A User can have many Places they submitted (optional)
      User.hasMany(models.Place, {
        foreignKey: 'userId',
        as: 'submittedPlaces',
        onDelete: 'SET NULL', // Or 'CASCADE' if user deletion should delete their places
        onUpdate: 'CASCADE',
      });
      
      // A User can have many Comments
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments', // Alias for the association
        onDelete: 'CASCADE', // If a user is deleted, their comments are also deleted
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Will be true for Google OAuth users if they don't set a password
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true, // Optional: if you want to enforce URL format
      },
    },
    discoveryStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Standard timestamps
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Explicitly define table name
    // timestamps: true, // Sequelize handles createdAt and updatedAt by default if not defined explicitly
  });

  return User;
};
