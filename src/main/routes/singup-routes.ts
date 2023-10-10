import { Router } from "express";
import { makeSingUpController } from "../factories/singup/singup-validation-factory";
import { adaptRoute } from "../adapters/express/express-route-adapter";

export default (router: Router): void => {
    router.post('/singup', adaptRoute(makeSingUpController()))
}