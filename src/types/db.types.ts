export type  DBType = {
    blogs: BlogDBType[],
    posts: PostDBType[]
}


//AUTH
export type LoginInputType = {
    loginOrEmail: string;
    password: string;
}

export type RegistrationConfirmationCode = {
    code: string;
}

export type MeType = {
    email: string,
    login: string,
    userId: string,
}


//BLOG
export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string,
}

export class BlogDBType {
    constructor(public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string,
                public isMembership: boolean,) {
    }
}

export type BlogOutputType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
    isMembership: boolean
}

export type BlogPostInputType = {
    title: string,
    shortDescription: string,
    content: string
}


//COMMENT
export type CommentInputType = {
    content: string,
}

export class CommentDBType {
    constructor(public postId: string,
                public content: string,
                public commentatorInfo: CommentatorInfoType,
                public createdAt: string) {
    }
}


export type CommentatorInfoType = {
    userId: string,
    userLogin: string,
}

export type CommentOutputType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string,
}


//POST
export type PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type PostDBType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PostOutputType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}


//USER
export type UserInputType = {
    login: string,
    password: string,
    email: string,
}

export type accountDataType = {
    login: string,
    passwordHash: string,
    email: string,
    createdAt: string
}

export type ConfirmationType = {
    confirmationCode: string,
    issuedAt: Date,
    expirationDate: Date,
    isConfirm: boolean,
}

export class UserDBType {
    constructor(public accountData: accountDataType,
                public emailConfirmation: ConfirmationType,) {
    }
}

export type UserOutputType = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
}

//REFRESH TOKEN BLACKLIST
export type BlackListRefreshTokensType = {
    refreshToken: string,
}

//SECURITY_DEVICES
export type DevicesDBType = {
    userId: string,
    title: string,
    ip: string,
    iat: number,
    exp: number,
}

export type DevicesOutputType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
}

export type  DeviceRateDBType = {
    IP: string,
    URL: string,
    date: Date
}






