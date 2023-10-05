import { DbAddAccount } from "./db-add-account";
import { AccountModel, AddAccountRepository, AddAccountModel, Hasher } from "./db-add-account-protocols";




const makeEncrypter = () :  Hasher => {
    class EncrypterStub  implements Hasher {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepository = () :  AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {

            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_mail@mail.com',
        password: 'valid_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
        name: 'valid_name',
        email: 'valid_mail@mail.com',
        password: 'valid_password'
})

interface SutTypes {
    sut: DbAddAccount
    encrypterStub:  Hasher
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}



describe('DbAddAccount Usecase', () => {
    // @ts-ignore
    test('Should call Hasher with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })

    // @ts-ignore
    // test('Should throw if Hasher throws', async () => {
    //     const { sut, encrypterStub } = makeSut()
    //     jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    //     const promise = sut.add(makeFakeAccountData())
    //     await expect(promise).rejects.toThrow()
    // })

    // // @ts-ignore
    // test('Should call AddAccount Repository with correct values', async () => {
    //     const { sut, addAccountRepositoryStub } = makeSut()
    //     const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    //     await sut.add(makeFakeAccountData())
    //     expect(addSpy).toHaveBeenCalledWith({
    //         name: 'valid_name',
    //         email: 'valid_mail@mail.com',
    //         password: 'hashed_password'
    //     })
    // })

    // @ts-ignore
    test('Should call AddAccount Repository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccountData())
        await expect(promise).rejects.toThrow()
    })

    // @ts-ignore
    test('Should returns and account on success', async () => {
        const { sut} = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makeFakeAccount())
    })


})