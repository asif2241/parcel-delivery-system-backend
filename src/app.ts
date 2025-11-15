import cookieParser from "cookie-parser"
import express, { Request, Response, urlencoded } from "express"
import expressSession from "express-session"
import passport from "passport"
import cors from "cors"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import { envVars } from "./app/config/env"
import "./app/config/passport"

const app = express()

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1);
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000", "https://b5-a5-parcel-delivery-system.vercel.app"],
    credentials: true
}))



app.use("/api/v1", router)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery System Backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app