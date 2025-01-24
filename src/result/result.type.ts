import {ResultStatus} from "./resultCode";

type ExtentionType = {
    field: string | null;
    message: string;
}

export type Result<T = null> = {
    status: ResultStatus;
    errorMessage?: string;
    extensions: ExtentionType[];
    data: T;
}