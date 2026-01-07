import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { CourseController } from "../controllers/CourseController";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();


const userController = new UserController();
const authController = new AuthController();
const courseController = new CourseController();


routes.post("/users", userController.create);
routes.post("/login", authController.login);

routes.post("/courses", authMiddleware, courseController.create);

export default routes;