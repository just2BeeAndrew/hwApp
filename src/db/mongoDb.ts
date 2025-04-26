import {MongoClient, Collection} from "mongodb";
import mongoose from "mongoose";
import {
    BlogDBType,
    CommentDBType,
    PostDBType,
    UserDBType,
    BlackListRefreshTokensType,
    DevicesDBType,
    LikeStatus,
    LikesDBType, PostsLikesDBType, ExtendedLikesInfoType
} from "../types/db.types";
import {SETTINGS} from "../settings";
import * as dotenv from "dotenv";

dotenv.config();

//---COLLECTION---

export let tokensCollection: Collection<BlackListRefreshTokensType>
export let devicesCollection: Collection<DevicesDBType>

//---SCHEMAS---

const BlogsSchema = new mongoose.Schema<BlogDBType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
});

const LikesDetailsSchema = new mongoose.Schema({
    addedAt: {type: String, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: true}
});

const ExtendedLikesInfoSchema = new mongoose.Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    myStatus: {
        type: String,
        enum: Object.values(LikeStatus),
        default: LikeStatus.None
    },
    newestLikes: {
        type: [LikesDetailsSchema],
        default: []
    },
})

const PostsSchema = new mongoose.Schema<PostDBType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: {type: ExtendedLikesInfoSchema},
});

const CommentsSchema = new mongoose.Schema<CommentDBType>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, default: 0},
        dislikesCount: {type: Number, default: 0},
        myStatus: {
            type: String,
            enum: Object.values(LikeStatus),
            default: LikeStatus.None
        },
    }
});

const UserSchema = new mongoose.Schema<UserDBType>({
    accountData: {
        login: {type: String, required: true},
        passwordHash: {type: String, required: true},
        email: {type: String, required: true},
        createdAt: {type: String, required: true}
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        recoveryCode: {type: String, default: null},
        issuedAt: {type: Date, required: true},
        expirationDate: {type: Date, required: true},
        isConfirm: {type: Boolean, required: true}
    }
});

const DeviceRateSchema = new mongoose.Schema({
    IP: String,
    URL: String,
    date: {
        type: Date,
        expires: 10,
        default: Date.now
    }
});

const LikesSchema = new mongoose.Schema<LikesDBType>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    status: {type: String, enum: Object.values(LikeStatus), required: true},
});

const ReactionForPostsSchema = new mongoose.Schema<PostsLikesDBType>({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    status: {type: String, enum: Object.values(LikeStatus), required: true},
    addedAt: {type: String, required: true},
});

//---MODELS---

export const BlogsModel = mongoose.model(SETTINGS.PATH.BLOGS, BlogsSchema)
export const PostsModel = mongoose.model(SETTINGS.PATH.POSTS, PostsSchema)
export const CommentsModel = mongoose.model(SETTINGS.PATH.COMMENTS, CommentsSchema)
export const UserModelClass = mongoose.model(SETTINGS.PATH.USERS, UserSchema)
export const DeviceRateModel = mongoose.model(SETTINGS.PATH.DEVICES, DeviceRateSchema);
export const LikesModel = mongoose.model(SETTINGS.PATH.LIKES, LikesSchema)
export const ReactionForPostsModel = mongoose.model(SETTINGS.PATH.POSTS_LIKES, ReactionForPostsSchema)

let client: MongoClient

export async function runMongoDb(url: string): Promise<boolean> {
    client = new MongoClient(url)//удалить при полном переводе на mongoose
    let db = client.db(SETTINGS.DB_NAME)//удалить при полном переводе на mongoose

    tokensCollection = db.collection<BlackListRefreshTokensType>(SETTINGS.PATH.BLACKLIST)
    devicesCollection = db.collection<DevicesDBType>(SETTINGS.PATH.SECURITY_DEVICES)

    try {
        await client.connect();//удалить при полном переводе на mongoose
        await mongoose.connect(SETTINGS.MONGO_URL)

        if (mongoose.connection.readyState !== 1) {
            throw new Error('Не встал =(')
        }
        console.log('У нас 10 секунд...ДвИиигаем!!! -До чего? -До полного п*****а, сынуля, до пОООлного п****а!!! © Баба Зина ')
        console.log('Не упал @_@')
        return true
    } catch (error) {
        console.log(error);
        console.log("Упал *0*")
        await client.close();//удалить при полном переводе на mongoose
        await mongoose.disconnect();
        return false;
    }
}

export async function stopMongoDb() {
    try {
        if (client) {
            await client.close();
        }
        await mongoose.disconnect();
        console.log("🛑Лёг полежать ...zzz")
    } catch (error) {
        console.error("❌0❌ не могу уснуть");
    }
}

export async function dropMongoDb(): Promise<void> {
    try {
        await tokensCollection.deleteMany({});
        await devicesCollection.deleteMany({});
        console.log("🧹 ПХД");
    } catch (error) {
        console.error("❌ Отмена ПХД:", error);
    }
}






