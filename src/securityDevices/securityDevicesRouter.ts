import {Router, Request, Response} from 'express';
import {securityDevicesQueryRepository} from "./securityDevicesQueryRepository";
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {devicesService} from "./devicesService";
import {HttpStatuses} from "../types/httpStatuses";

export const securityDeviceRouter = Router();

export const securityDeviceController = {
    async getAllDevices(req: Request, res: Response) {
        const devices = await securityDevicesQueryRepository.getAllDevicesSessions(req.user!.id)
        res.status(200).json(devices)
    },

    async deleteExcludeCurrentSessions(req: Request, res: Response) {
        const userId = req.user!.id
        const deviceId = req.device!.deviceId
        await devicesService.terminateOtherSessions(userId, deviceId)
        res.status(HttpStatuses.NOCONTENT)

    },

    async deleteSessionsById(req: Request, res: Response) {
        const deviceId = req.device!.deviceId
        await devicesService.deleteSessionsById(deviceId)
        res.status(HttpStatuses.NOCONTENT)
    }
}

securityDeviceRouter.get('/',
    refreshTokenMiddleware,
    errorsResultMiddleware,
    securityDeviceController.getAllDevices)
securityDeviceRouter.delete('/', securityDeviceController.deleteExcludeCurrentSessions)
securityDeviceRouter.delete('/:deviceId', securityDeviceController.deleteSessionsById)