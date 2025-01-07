import {testingRepository} from "../repositories/testingRepository";

export const testingService = {
    async deleteAll(){
        return await testingRepository.deleteAll()
    }

}