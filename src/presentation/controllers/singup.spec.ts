import { SingUpController } from './singup'
import { MissingParamError } from "../errors/missing-param-error";

describe('SingUp Controller', () => {
    // @ts-ignore
    test('Should return 400 if no name is provided', () => {
        const sut = new SingUpController()
        const httpRequest = {
            body: {
            email: 'any_email@mail.com',
            password: 'any_password',
            passwordConfirmation: 'any_password'
        }
    }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))

    })

    // @ts-ignore
    test('Should return 400 if no name is provided', () => {
        const sut = new SingUpController()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))

    })


})