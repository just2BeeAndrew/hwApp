import {LoginInputType} from "../types/db.types";
import {authrizationRepository} from "../repositories/authorizationRepository";


export const authorizationService = {
    async authorization(authorizationData:LoginInputType){
        const auth = await authrizationRepository.authorization(authorizationData);

    }
}