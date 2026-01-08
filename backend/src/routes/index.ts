import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { CourseController } from "../controllers/CourseController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { SubscriptionController } from "../controllers/SubscriptionController";

const routes = Router();


const userController = new UserController();
const authController = new AuthController();
const courseController = new CourseController();
const subscriptionController = new SubscriptionController();


routes.post("/users", userController.create);
routes.post("/login", authController.login);
routes.post("/courses", authMiddleware, courseController.create);
routes.post("/subscribe", authMiddleware, subscriptionController.create);
routes.get("/my-courses", authMiddleware, subscriptionController.listMyCourses);

export default routes;