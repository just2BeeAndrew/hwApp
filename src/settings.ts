import {config} from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3004,
    AUTH:{
        LOGIN: 'admin',
        PASSWORD: 'qwerty',
    },
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing/all-data',
    },
    MONGO_URL:process.env.MONGO_URL || 'mongodb://localhost/',
    DB_NAME:process.env.DB_NAME || '',
}