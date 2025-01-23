import { Router, Request, Response } from 'express';
import {testingService} from "./testingService";
export const testingRouter = Router();

export const testingController = {
    async deleteAll(req: Request, res: Response) {
        const deleteAll = await testingService.deleteAll();
        res.sendStatus(204)
    }
}

testingRouter.delete('/', testingController.deleteAll);