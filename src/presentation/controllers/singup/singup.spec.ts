import { SingUpController } from './singup'
import { MissingParamError, ServerError } from "../../errors";
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation } from "./singup-protocols";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";



const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount{
        async add(account: AddAccountModel): Promise<AccountModel> {
          return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation{
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'

})

interface SutTypes {
    sut: SingUpController
    addAccountStub: AddAccount
    validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})


const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SingUpController(addAccountStub, validationStub)
    return {
        sut,
        addAccountStub,
        validationStub
    }
}


describe('SingUp Controller', () => {

    // @ts-ignore
    test('Should call AddAccount with correct values', async () => {
        const {sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        await sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        })
    })

    // @ts-ignore
    test('Should return 500 if AddAccount throws', async () => {
        const {sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(Error()))
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError(null)))


    })

    // @ts-ignore
    test('Should return 200 if invalid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    // @ts-ignore
    test('Should call Validation with correct values', async () => {
        const {sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(makeFakeRequest())
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    // @ts-ignore
    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})