export type  DBType = {
    blogs: BlogDbType[],
    posts: PostDBType[]
}

export type LoginInputType = {
    loginOrEmail: string;
    password: string;
}

export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type BlogDbType = {
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

export type UserInputType = {
    login: string,
    password: string,
    email: string,
}

export type UserDBType = {
    id: string,
    login: string,
    password: string,
    email: string,
    createdAt: string
}

export type UserOutputType = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
}







