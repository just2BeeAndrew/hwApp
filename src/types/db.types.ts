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

export class CommentatorInfoType {
    constructor(public userId: string,
                public userLogin: string) {
    }
}

export enum LikeStatus {
    "Like" = "Like",
    "Dislike" = "Dislike",
    "None" = "None",
}

export class LikesInfoType {
    constructor(public likesCount: number = 0,
                public dislikesCount: number = 0,
                public myStatus: LikeStatus = LikeStatus.None,
    ) {
    }
}

export class CommentDBType {
    constructor(public postId: string,
                public content: string,
                public commentatorInfo: CommentatorInfoType,
                public createdAt: string,
                public likesInfo: LikesInfoType = new LikesInfoType()) {
    }
}

export class CommentOutputType {
    constructor(
        public id: string,
        public content: string,
        public commentatorInfo: CommentatorInfoType,
        public createdAt: string,
        public likesInfo: LikesInfoType) {
    }
}

export class LikesDBType {
    constructor(public userId: string,//айди того кто поставил реакцию
                public commentId: string,// айди комментария
                public status: LikeStatus,
    ) {
    }
}

export class PostsLikesDBType {
    constructor(public userId: string,
                public postId: string,
                public status: LikeStatus,
                public addedAt: string,
    ) {
    }
}


//POST
export type PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export class PostDBType {
    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public extendedLikesInfo: ExtendedLikesInfoType = new ExtendedLikesInfoType()) {
    }
}

export class ExtendedLikesInfoType {
    constructor(public likesCount: number = 0,
                public dislikesCount: number = 0,
                public myStatus: LikeStatus = LikeStatus.None,
                public newestLikes: LikesDetailsType[] | null = null) {
    }
}

export class LikesDetailsType {
    constructor(public addedAt: string,
                public userId: string | null,
                public login: string | null,) {
    }
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

export class accountDataType {
    constructor(
        public login: string,
        public passwordHash: string,
        public email: string,
        public createdAt: string
    ) {
    }
}

export class ConfirmationType {
    constructor(
        public confirmationCode: string,
        public recoveryCode: string | null,
        public issuedAt: Date,
        public expirationDate: Date,
        public isConfirm: boolean,
    ) {
    }
}

export class UserDBType {
    constructor(public accountData: accountDataType,
                public emailConfirmation: ConfirmationType) {
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

export class DeviceRateDBType {
    constructor(
        public IP: string,
        public URL: string,
        public date: Date
    ) {
    }
}

export class ConfirmPasswordType {
    constructor(public newPassword: string,
                public recoveryCode: string) {
    }
}






