import "reflect-metadata"
import {UsersRepository} from "./users/usersRepository";
import {UsersService} from "./users/usersService";
import {UsersController} from "./users/usersController";
import {Container} from "inversify";

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

container.bind(UsersController).to(UsersController);
container.bind<UsersService>(UsersService).to(UsersService);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);