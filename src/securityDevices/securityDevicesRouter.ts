import {Router, Request, Response} from 'express';

export const securityDeviceRouter = Router();

export const securityDeviceController = {
    async getAllDevices(req: Request, res: Response) {

    },

    async deleteExcludeCurrentSessions(req: Request, res: Response) {

    },

    deleteSessionsById(req: Request, res: Response) {

    }
}

securityDeviceRouter.get('/', securityDeviceController.getAllDevices)
securityDeviceRouter.delete('/', securityDeviceController.deleteExcludeCurrentSessions)
securityDeviceRouter.delete('/:deviceId', securityDeviceController.deleteSessionsById)