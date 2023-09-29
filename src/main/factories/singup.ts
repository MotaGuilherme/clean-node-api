import { SingUpController } from "../../presentation/controllers/singup/singup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { DbAddAccount } from "../../data/usecases/addaccount/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { Controller } from "../../presentation/protocols";
import { LogControllerDecorator } from "../decorator/logs";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { makeSingUpValidation } from "./singup-validation";



export const makeSingUpController = (): Controller => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const singUpController = new SingUpController(emailValidatorAdapter, dbAddAccount, makeSingUpValidation())
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(singUpController, logMongoRepository)
}