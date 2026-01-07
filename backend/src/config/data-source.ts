import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Course } from "../entities/Course";

export const AppDataSource = new DataSource({
  type: "sqlite", 
  database: "database.sqlite", 
  synchronize: true, 
  logging: false, 
  entities: [User, Course], 
  subscribers: [],
  migrations: [],
});