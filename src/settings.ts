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
    },
    MONGO_URL:process.env.MONGO_URL||"",
    DB_NAME:process.env.DB_NAME||"testing",
    JWT_SECRET: process.env.JWT_SECRET||"123",
}