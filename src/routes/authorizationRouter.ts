import {Router, Request, Response} from 'express';
import {LoginInputType} from "../types/db.types";
import {authorizationService} from "../domains/authorizationService";

export const authorizationRouter = Router();

export const authorizationController = {
    async authorization(req: Request<LoginInputType>, res: Response) {
        const auth = await authorizationService.authorization(req.body);
        res.sendStatus(204)
    },
}

authorizationRouter.post('/',authorizationController.authorization)

