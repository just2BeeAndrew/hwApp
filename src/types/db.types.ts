export type  DBType = {
    blogs: BlogDBType[],
    posts: PostDBType[]
}


//AUTH
export type LoginInputType = {
    loginOrEmail: string;
    password: string;
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

export type BlogDBType = {
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


//POST
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


//USER
export type UserInputType = {
    login: string,
    password: string,
    email: string,
}

export type UserDBType = {
    login: string,
    passwordHash: string,
    passwordSalt: string,
    email: string,
    createdAt: string
}

export type UserOutputType = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
}







