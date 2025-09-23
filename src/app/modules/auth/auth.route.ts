import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

export const AuthRoutes = Router();

AuthRoutes.post("/login", AuthControllers.credentialsLogin);
AuthRoutes.post("/refresh-token", AuthControllers.getNewAccessToken);
AuthRoutes.post("/logout", AuthControllers.logout);
AuthRoutes.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);
AuthRoutes.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword)
AuthRoutes.post("/forgot-password", AuthControllers.forgotPassword)
AuthRoutes.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)


AuthRoutes.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

AuthRoutes.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login` }), AuthControllers.googleCallbackController)