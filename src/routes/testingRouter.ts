import { Router, Request, Response } from 'express';
import {testingRepository} from "../repositories/testingRepository";
import {body, validationResult } from "express-validator";

export const testingRouter = Router();

export const testingController = {
    deleteAll(req: Request, res: Response) {
        const deleteAll = testingRepository.deleteAllBlogs();
        res.sendStatus(204)
    }
}

testingRouter.delete('/', testingController.deleteAll);