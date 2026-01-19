import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { CourseController } from "../controllers/CourseController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { SubscriptionController } from "../controllers/SubscriptionController";
import { validateResource } from "../middlewares/ValidateResource"; 
import { userSchema } from "../schemas/userSchema";
import { loginSchema } from "../schemas/loginSchema";
import { courseSchema } from "../schemas/courseSchema";
import { subscriptionSchema } from "../schemas/subscriptionSchema";

const routes = Router();

const userController = new UserController();
const authController = new AuthController();
const courseController = new CourseController();
const subscriptionController = new SubscriptionController();


routes.post("/users", validateResource(userSchema), userController.create);
routes.post("/login", validateResource(loginSchema), authController.login);
routes.get("/courses", courseController.list);

routes.use(authMiddleware);

routes.post("/courses", validateResource(courseSchema), courseController.create);
routes.post("/subscribe", validateResource(subscriptionSchema), subscriptionController.create);
routes.get("/my-courses", subscriptionController.listMyCourses);
routes.get("/my-dashboard", courseController.listMyCourses);
routes.put("/courses/:id", validateResource(courseSchema), courseController.update);
routes.delete("/courses/:id", authMiddleware, courseController.delete);

export default routes;