import {validationResult} from "express-validator"
import {NextFunction,Request,Response} from "express"

export const errorsResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).send({errorsMessages: errors
                .array({onlyFirstError: true})
                .map((err) => {
                    return {message: err.msg, field: (err as any).path}
                }),
        })
        return
    } else
        next()
}