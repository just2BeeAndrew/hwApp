import { Router, Request, Response } from 'express';
import {testingRepository} from "../repositories/testingRepository";

export const testingRouter = Router();

export const testingController = {
    deleteAll() {

    }

}

testingRouter.delete('/', testingController.deleteAll);