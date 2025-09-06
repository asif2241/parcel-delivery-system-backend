import { Router } from "express";
import { UserController } from "./user.controller";

export const UserRoutes = Router();

UserRoutes.post("/register", UserController.createUser)
UserRoutes.get("/all-users", UserController.getAllUsers)
UserRoutes.get("/:id", UserController.getSingleUser)
UserRoutes.patch("/:id", UserController.updateUser)