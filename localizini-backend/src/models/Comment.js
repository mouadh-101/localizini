import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      // A Comment belongs to a User
      Comment.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'commenter', // Alias for the association
        onDelete: 'CASCADE', // If user is deleted, their comments are also deleted
      });

      // A Comment belongs to a Place
      Comment.belongsTo(models.Place, {
        foreignKey: {
          name: 'placeId',
          allowNull: false,
        },
        as: 'place', // Alias for the association
        onDelete: 'CASCADE', // If place is deleted, its comments are also deleted
      });
    }
  }

  Comment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: { // Optional rating associated with the comment/review
      type: DataTypes.INTEGER,
      allowNull: true, // Rating can be optional
      validate: {
        min: 1,
        max: 5,
      },
    },
    // userId and placeId are defined by associations
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
    modelName: 'Comment',
    tableName: 'Comments',
  });

  return Comment;
};
