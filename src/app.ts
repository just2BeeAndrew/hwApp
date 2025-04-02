import express from 'express'
import cors from 'cors'
import {blogRouter} from "./blogs/blogRouter";
import {postRouter} from "./posts/postRouter";
import {testingRouter} from "./testing/testingRouter";
import {SETTINGS} from "./settings";
import {authRouter} from "./auth/authRouter";
import {userRouter} from "./users/userRouter";
import {commentRouter} from "./comments/commentRouter";
import cookieParser from "cookie-parser";
import {HttpStatuses} from "./types/httpStatuses";
import {securityDeviceRouter} from "./securityDevices/securityDevicesRouter";

export const app = express() // создать приложение
app.set('trust proxy', true);
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк
app.use(cookieParser())
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.COMMENTS, commentRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.USERS, userRouter)
app.use(SETTINGS.PATH.SECURITY_DEVICES, securityDeviceRouter)

app.get('/', (req, res) => {
    res.status(HttpStatuses.SUCCESS).json("Всё работает")
})