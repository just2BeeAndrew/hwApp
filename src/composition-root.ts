import {UsersRepository} from "./users/usersRepository";
import {UsersService} from "./users/usersService";

import {UsersController} from "./users/usersController";

const userRepository = new UsersRepository();
const usersService = new UsersService(userRepository)

export const usersController = new UsersController(usersService)