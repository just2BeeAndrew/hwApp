import {body} from "express-validator";
import {BlogsModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";

//blogs validation
export const nameValidator = body("name")
    .isString()
    .withMessage("name should be a string")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({min: 1, max: 15})
    .withMessage("name should contain 1 - 15 symbols")

export const descriptionValidator = body("description")
    .isString()
    .withMessage("description should be a string")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({min: 1, max: 500})
    .withMessage("description should contain 1 - 500 symbols")

export const websiteUrlValidator = body("websiteUrl")
    .isString()
    .withMessage("websiteUrl should be a string")
    .trim()
    .notEmpty()
    .withMessage("websiteUrl is required")
    .isLength({min: 1, max: 100})
    .withMessage("websiteUrl should contain 1 - 100 symbols")
    .isURL()
    .withMessage("websiteUrl should be a valid URL")

//posts validation
export const titleValidator = body("title")
    .isString()
    .withMessage("title should be a string")
    .trim()
    .notEmpty()
    .withMessage("title is required")
    .isLength({min: 1, max: 30})
    .withMessage("title should contain 1 - 30 symbols")

export const shortDescriptionValidator = body("shortDescription")
    .isString()
    .withMessage("shortDescription should be a string")
    .trim()
    .notEmpty()
    .withMessage("shortDescription is required")
    .isLength({min: 1, max: 100})
    .withMessage("shortDescription should contain 1 - 100 symbols")

export const postContentValidator = body("content")
    .isString()
    .withMessage("content should be a string")
    .trim()
    .notEmpty()
    .withMessage("content is required")
    .isLength({min: 1, max: 1000})
    .withMessage("content should contain 1 - 100 symbols")

export const blogIdValidator = body("blogId")
    .isString()
    .withMessage("content should be a string")
    .trim()
    .notEmpty()
    .withMessage("content is required")
    .custom(async (blogId) => {
        const object_Id = new ObjectId(blogId)
        const blog = await BlogsModel.findOne({_id: object_Id});
        if (!blog) throw new Error("blog index not found");
        return !!blog
    })
    .withMessage("blog isn't exists")

//users validator
export const loginValidator = body("login")
    .isString()
    .withMessage("login should be a string")
    .trim()
    .notEmpty()
    .withMessage("login is required")
    .isLength({min: 3, max: 10})
    .withMessage("content should contain 3 - 10 symbols")
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("incorrect symbols")

export const passwordValidator = body("password")
    .isString()
    .withMessage("passwords should be a string")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({min: 6, max: 20})
    .withMessage("password should contain 6 - 20 symbols")

export const newPasswordValidator = body("newPassword")
    .isString()
    .withMessage("passwords should be a string")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({min: 6, max: 20})
    .withMessage("password should contain 6 - 20 symbols")

export const emailValidator = body("email")
    .isString()
    .withMessage("email should be a string")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Email should be a valid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Invalid email format");

//comments validator
export const commentContentValidator = body("content")
    .isString()
    .withMessage("content shoud be a string")
    .trim()
    .notEmpty()
    .withMessage("content is required")
    .isLength({min: 20, max: 300})
    .withMessage("content should be a 20 - 300 symbols")

export const recoveryCodeValidator = body("recoveryCode")
    .isString()
    .withMessage("Recovery code should be a string")



export const blogsMwArr = [nameValidator, descriptionValidator, websiteUrlValidator]
export const postsMwArr = [titleValidator, shortDescriptionValidator, postContentValidator, blogIdValidator]
export const usersMwArr = [loginValidator, passwordValidator, emailValidator]
export const commentsMwArr = [commentContentValidator]