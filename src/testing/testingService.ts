import {testingRepository} from "./testingRepository";

export const testingService = {
    async deleteAll(){
        return await testingRepository.deleteAll()
    }

}