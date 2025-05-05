import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {UsersRepository} from "../users/usersRepository";
import {IdType} from "../types/id";
import {container} from "../composition-root";

const usersRepository = container.get(UsersRepository);

export const authChecker = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split(" ")[1];
        const payload = await jwtService.verifyAccessToken(accessToken);
        if (payload) {
            const {userId} = payload;
            const user = await usersRepository.doesExistById(userId);
            if (user) {
                req.user = {id: userId} as IdType;
            }
        }
    }
    next();
}