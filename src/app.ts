import express from 'express'
import cors from 'cors'
import {blogRouter} from "./routes/blogRouter";
import {postRouter} from "./routes/postRouter";
import {testingRouter} from "./routes/testingRouter";
import {SETTINGS} from "./settings";
import {authRouter} from "./routes/authRouter";
import {userRouter} from "./routes/userRouter";

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.USERS, userRouter)


app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json("Всё работает")
})