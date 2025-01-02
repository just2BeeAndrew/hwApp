import {ObjectId} from "mongodb";

export type  DBType = {
    blogs: BlogDbType[],
    posts: PostDBType[]
}

export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type BlogDbType = {
    //_id: ObjectId,
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
    isMembership: boolean
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

export type PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type PostDBType = {
    id: string,
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





