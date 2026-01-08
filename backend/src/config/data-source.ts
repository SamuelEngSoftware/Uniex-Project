import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Course } from "../entities/Course";
import { Subscription } from "../entities/Subscription";

export const AppDataSource = new DataSource({
  type: "sqlite", 
  database: "database.sqlite", 
  synchronize: true, 
  logging: false, 
  entities: [User, Course, Subscription], 
  subscribers: [],
  migrations: [],
});