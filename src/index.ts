import {initApp} from './app'
import {SETTINGS} from './settings'
import {runMongoDb} from './db/mongoDb'
import {HttpStatuses} from "./types/httpStatuses";
import {mongo} from "mongoose";

const app = initApp()

app.get('/', (req, res) => {
    res.status(HttpStatuses.SUCCESS).json("I'm Alive ")
});

const startApp = async () => {
    const res = await runMongoDb(SETTINGS.MONGO_URL)
    if (!res) process.exit(1)

    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}
startApp()