export type  DBType = {
    blogs: BlogDbType[],
    posts: PostType[]
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

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}





