import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors";


interface SutTypes {
    sut: LoginController
}
const makeSut = (): SutTypes => {
    const sut = new LoginController()
    return {
        sut
    }
}

describe('Login Controller', () => {

    // @ts-ignore
    test('Should return if no email id provided ', async () => {
        const {sut} = makeSut()
        const httpResquest = {
            body: {
                password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpResquest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    // @ts-ignore
    test('Should return if no password id provided ', async () => {
        const {sut} = makeSut()
        const httpResquest = {
            body: {
                email: 'any_email@mail.com'
            }
        }
        const httpResponse = await sut.handle(httpResquest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
})