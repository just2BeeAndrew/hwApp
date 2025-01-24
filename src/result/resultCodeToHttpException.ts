import {ResultStatus} from "./resultCode";
import {HttpStatuses} from "../types/httpStatuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
    switch (resultCode) {
        case ResultStatus.Success:
            return HttpStatuses.SUCCESS;
        case ResultStatus.Created:
            return HttpStatuses.CREATED;
        case ResultStatus.NoContent:
            return HttpStatuses.NOCONTENT;
        case ResultStatus.BadRequest:
            return HttpStatuses.BAD_REQUEST;
        case ResultStatus.Unauthorized:
            return HttpStatuses.UNAUTHORIZED;
        case ResultStatus.Forbidden:
            return HttpStatuses.FORBIDDEN;
        case ResultStatus.NotFound:
            return HttpStatuses.NOT_FOUND;
        default:
            return HttpStatuses.SERVER_ERROR
    }
};