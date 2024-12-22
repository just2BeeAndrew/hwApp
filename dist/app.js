"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const blogRouter_1 = require("./routes/blogRouter");
const postRouter_1 = require("./routes/postRouter");
const testingRouter_1 = require("./routes/testingRouter");
const settings_1 = require("./settings");
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.use((0, cors_1.default)()); // разрешить любым фронтам делать запросы на наш бэк
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogRouter_1.blogRouter);
exports.app.use(settings_1.SETTINGS.PATH.POSTS, postRouter_1.postRouter);
exports.app.use(settings_1.SETTINGS.PATH.TESTING, testingRouter_1.testingRouter);
exports.app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json("Всё работает");
});
