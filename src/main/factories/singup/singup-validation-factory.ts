import { SingUpController } from "../../../presentation/controllers/singup/singup-controller";
import { DbAddAccount } from "../../../data/usecases/addaccount/db-add-account";
import { BcryptAdapter } from "../../../infra/criptography/bcrypter-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorator/log-controller-decorator";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { makeSingUpValidation } from "./singup-factory";



export const makeSingUpController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const singUpController = new SingUpController(dbAddAccount, makeSingUpValidation())
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(singUpController, logMongoRepository)
}