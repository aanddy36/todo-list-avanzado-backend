import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/sequelize'; 
import User from '../users/models'; 

class Task extends Model {
  public id!: number;
  public name!: string;
  public completed!: boolean;
  public userId!: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
  }
);

User.hasMany(Task, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: "user"
});

export default Task;