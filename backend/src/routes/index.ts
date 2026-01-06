import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";

const routes = Router();


const userController = new UserController();
const authController = new AuthController();


routes.post("/users", userController.create);
routes.post("/login", authController.login);

export default routes;