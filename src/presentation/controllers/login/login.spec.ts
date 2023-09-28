import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";


const makeEmailValidaator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidaator()
    const sut = new LoginController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
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
        const { sut} = makeSut()
        const httpResquest = {
            body: {
                email: 'any_email@mail.com'
            }
        }
        const httpResponse = await sut.handle(httpResquest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    // @ts-ignore
    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpResquest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }
        await sut.handle(httpResquest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})