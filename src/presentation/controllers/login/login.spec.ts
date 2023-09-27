import {LoginController} from "./login";
import {badRequest} from "../../helpers/http-helper";
import {MissingParamError} from "../../errors";

describe('Login Controller', () => {

    // @ts-ignore
    test('Should return if no email id provided ', async () => {
        const sut = new LoginController()
        const httpResquest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpResquest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
})