import {SortType} from "../helpers/paginationValues";
import {usersCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {MeType, UserDBType, UserOutputType} from "../types/db.types";

export const userMapper = (user:WithId<UserDBType>):UserOutputType =>{
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}

export const meMapper = (user: WithId<UserDBType>):MeType =>{
    return {
        email: user.email,
        login: user.login,
        userId: user._id.toString(),
    }
}

export const usersQueryRepository = {
    async getAllUsers(sortData: SortType) {
        const {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = sortData;
        const filter: any = {}

        if (searchLoginTerm && searchEmailTerm) {
            filter.$or = [
                { login: { $regex: searchLoginTerm, $options: "i" } },
                { email: { $regex: searchEmailTerm, $options: "i" } }
            ];
        } else if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: "i" };
        } else if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: "i" };
        }
        const users = await usersCollection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const usersCount = await usersCollection.countDocuments(filter);
        return {
            pagesCount: Math.ceil(usersCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: usersCount,
            items: users.map(userMapper)
        }
    },

    async getUserBy_Id(_id: string) {
        const object_Id = new ObjectId(_id)
        const user = await usersCollection.findOne({_id: object_Id});
        if (!user) {
            return null
        }
        return userMapper(user);
    },

    async getInfoBy_Id(_id: string) {
        const object_Id = new ObjectId(_id)
        const user = await usersCollection.findOne({_id: object_Id});
        if (!user) {
            return null
        }
        return meMapper(user);
    },
}