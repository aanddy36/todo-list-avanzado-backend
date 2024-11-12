
import { Sequelize } from 'sequelize';
import * as dotenv from "dotenv";
dotenv.config()

const sequelize = new Sequelize('todo_list', process.env.DB_USER as string, process.env.DB_PASSWORD as string, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

export default sequelize;