import "reflect-metadata"
import {UsersRepository} from "./users/usersRepository";
import {UsersService} from "./users/usersService";
import {UsersController} from "./users/usersController";
import {Container} from "inversify";
import {AuthController} from "./auth/authController";
import {AuthService} from "./auth/authService";
import {CommentsController} from "./comments/commentsController";
import {CommentsService} from "./comments/commentsService";
import {CommentsRepository} from "./comments/commentsRepository";
import {CommentsQueryRepository} from "./comments/commentsQueryRepository";
import {PostsController} from "./posts/postsController";
import {PostsService} from "./posts/postsService";
import {PostsRepository} from "./posts/postsRepository";
import {BlogsController} from "./blogs/blogsController";
import {BlogsRepository} from "./blogs/blogsRepository";
import {BlogsService} from "./blogs/blogsService";
import {BlogsQueryRepository} from "./blogs/blogsQueryRepository";

// const objects:any[] = []
//
// const userRepository = new UsersRepository();
// objects.push(userRepository);
//
// const usersService = new UsersService(userRepository)
// objects.push(usersService);
//
// const usersController = new UsersController(usersService)
// objects.push(usersController);
//
// export const ioc = {
//     getInstance<T>(ClassType: any){
//         const targetInstance = objects.find(o => o instanceof ClassType);
//         return targetInstance;
//     }
// }

export const container = new Container();

//Users
container.bind(UsersController).to(UsersController);
container.bind<UsersService>(UsersService).to(UsersService);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);

//Auth
container.bind(AuthController).to(AuthController);
container.bind<AuthService>(AuthService).to(AuthService);

//comments
container.bind(CommentsController).to(CommentsController);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);
container.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository);

//Posts
container.bind(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository);

//Blogs
container.bind(BlogsController).to(BlogsController);
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);
container.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository);