import { Router } from "express";
import { makeSingUpController } from "../factories/singup/singup-validation-factory";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeLoginController } from "../factories/login/login-factory";

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSingUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
}