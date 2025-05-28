import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Place extends Model {
    static associate(models) {
      // A Place can be optionally submitted by a User
      Place.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'submittedBy', // Alias for the association
        allowNull: true, 
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE', // Added for consistency
      });
      // A Place will have many Comments
      Place.hasMany(models.Comment, { 
        foreignKey: 'placeId', 
        as: 'comments',
        onDelete: 'CASCADE', // If a place is deleted, its comments are also deleted
      });
    }
  }

  Place.init({
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Description can be optional
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: -90, max: 90 },
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: -180, max: 180 },
    },
    category: { // e.g., 'cafe', 'bar', 'hotel', 'music'
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOpen: { // For "Open now" filter
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    vibe: { // e.g., 'cozy', 'romantic', 'electric', 'luxurious'
      type: DataTypes.STRING,
      allowNull: true,
    },
    funFact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: { // For search and filtering
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    userId: { // Foreign key for the user who submitted this place (optional)
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users', // Name of the target table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    modelName: 'Place',
    tableName: 'Places',
  });

  return Place;
};
