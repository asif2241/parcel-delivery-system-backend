import { Router } from "express";
import { ParcelControllers } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const ParcelRoutes = Router()

ParcelRoutes.post("/create-parcel", checkAuth(Role.SENDER, Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.createParcel)

ParcelRoutes.get("/all-parcel", checkAuth(...Object.values(Role)), ParcelControllers.getAllParcel)

ParcelRoutes.get("/:id", checkAuth(...Object.values(Role)), ParcelControllers.getSingleParcelById)

ParcelRoutes.patch("/cancel/:id", checkAuth(Role.SENDER), ParcelControllers.cancelParcel)

ParcelRoutes.get("/track/:trackingId", ParcelControllers.trackParcel)

ParcelRoutes.patch("/update-status/:parcelId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.updateParcelStatus)