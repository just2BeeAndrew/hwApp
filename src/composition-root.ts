import {UsersRepository} from "./users/usersRepository";
import {UsersService} from "./users/usersService";

import {UsersController} from "./users/usersController";

const objects:any[] = []

const userRepository = new UsersRepository();
objects.push(userRepository);

const usersService = new UsersService(userRepository)
objects.push(usersService);

const usersController = new UsersController(usersService)
objects.push(usersController);

export const ioc = {
    getInstance<T>(ClassType: any){
        const targetInstance = objects.find(o => o instanceof ClassType);
        return targetInstance as T;
    }
}