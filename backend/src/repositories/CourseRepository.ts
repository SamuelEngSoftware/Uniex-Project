import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";
import {Like, FindManyOptions } from "typeorm";

export const CourseRepository = AppDataSource.getRepository(Course).extend({

    async listAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const queryOptions: FindManyOptions<Course> = {
      take: limit,
      skip: skip,
      relations: ["coordenador"],
      select: {
        coordenador: { id: true, name: true, email: true }
      },
      order: { created_at: "DESC" }
    };

    if (search) {
      queryOptions.where = { 
        title: Like(`%${search}%`) 
      };
    }
    return this.findAndCount(queryOptions);
  },
  async findForDashboard(userId: string, isAdmin: boolean, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const queryOptions: FindManyOptions<Course> = {
      take: limit,
      skip,
      order: { created_at: "DESC" },
      relations: ["coordenador"]
    };

    if (isAdmin) {
      queryOptions.relations = ["coordenador", "subscriptions", "subscriptions.user"];
    } else {
      queryOptions.where = { 
        coordenador: { id: userId } 
      };
    }
    return this.findAndCount(queryOptions);
  }
});