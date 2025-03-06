import {Request, Response, Router} from 'express';
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {devicesService} from "./devicesService";
import {HttpStatuses} from "../types/httpStatuses";
import {securityDevicesQueryRepository} from "./securityDevicesQueryRepository";
import {RequestWithParams} from "../types/requests";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {ResultStatus} from "../result/resultCode";

export const securityDeviceRouter = Router();

export const securityDeviceController = {
    async getAllDevices(req: Request, res: Response) {
        const devices = await securityDevicesQueryRepository.getAllDevicesSessions(req.user!.id)
        res.status(HttpStatuses.SUCCESS).json(devices)
    },

    async deleteExcludeCurrentSessions(req: Request, res: Response) {
        const userId = req.user!.id
        const deviceId = req.device!.deviceId
        await devicesService.terminateOtherSessions(userId, deviceId)
        res.sendStatus(HttpStatuses.NOCONTENT)

    },

    async deleteSessionsById(req: RequestWithParams<{ deviceId: string }>, res: Response) {
        const _id = req.device?.deviceId as string
        const userId = req.user?.id as string
        const deviceId = req.params.deviceId
        console.log(deviceId)
        const deleteSession = await devicesService.deleteSessionsById(deviceId, userId)
        if (deleteSession.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(deleteSession.status))
                .json(deleteSession.extensions)
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }
}

securityDeviceRouter.get('/',
    refreshTokenMiddleware,
    errorsResultMiddleware,
    securityDeviceController.getAllDevices)
securityDeviceRouter.delete('/',
    refreshTokenMiddleware,
    errorsResultMiddleware,
    securityDeviceController.deleteExcludeCurrentSessions)
securityDeviceRouter.delete('/:deviceId',
    refreshTokenMiddleware,
    errorsResultMiddleware,
    securityDeviceController.deleteSessionsById)