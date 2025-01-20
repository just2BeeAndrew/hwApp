import {UserDBType, UserOutputType} from "./db.types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserOutputType | null;
        }
    }
}

//req.user — когда тебе нужно работать с данными пользователя в middleware, контроллерах или бизнес-логике (например, проверка прав доступа).
// res.locals — когда тебе нужно передать данные в представления (например, для рендеринга шаблонов Handlebars).