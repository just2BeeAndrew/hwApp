import express from 'express'
import cors from 'cors'
import {blogRouter} from "./blogs/blogRouter";
import {postRouter} from "./posts/postRouter";
import {testingRouter} from "./testing/testingRouter";
import {SETTINGS} from "./settings";
import {authRouter} from "./auth/authRouter";
import {userRouter} from "./users/userRouter";
import {commentRouter} from "./comments/commentRouter";

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.COMMENTS, commentRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.USERS, userRouter)


app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json("Всё работает")
})