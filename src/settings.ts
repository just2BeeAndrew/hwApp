import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 1963,
    BASEAUTH:{
        LOGIN: 'admin',
        PASSWORD: 'qwerty',
    },
    PATH: {
        AUTH: '/auth',
        BLOGS: '/blogs',
        COMMENTS: '/comments',
        POSTS: '/posts',
        TESTING: '/testing/all-data',
        USERS: '/users',
        BLACKLIST: '/blacklist',
    },
    MONGO_URL:process.env.MONGO_URL||"",
    DB_NAME:process.env.DB_NAME||"testing",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TIKEN_SECRET||"7831",
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET||"3691",

}