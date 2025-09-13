import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

export const UserRoutes = Router();

UserRoutes.post("/register", UserController.createUser)
UserRoutes.get("/all-users", UserController.getAllUsers)
UserRoutes.get("/:id", UserController.getSingleUser)
UserRoutes.patch("/:id", checkAuth(...Object.values(Role)), UserController.updateUser)