import { DbAuthentication } from "./db-authentication";
import {
    AccountModel,
    LoadAccountByEmailRepository,
    AuthenticationModel,
    HashComparer,
    Encrypter,
    UpdateAccessTokenRepository
} from "./db-authentication-protocols";



const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_emai@mail.com',
    password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_emai@mail.com',
    password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashComparerStub()
}

const makeEncrypterGenerator = (): Encrypter => {
    class EncrypterGeneratorStub implements Encrypter {
        async generate(id: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new EncrypterGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async updateAccessToken (id: string, token: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterGeneratorStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}
const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const encrypterGeneratorStub = makeEncrypterGenerator()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterGeneratorStub,
        updateAccessTokenRepositoryStub
    )
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterGeneratorStub,
        updateAccessTokenRepositoryStub
    }
}

describe('DbAuthentication UseCase', () => {

    // @ts-ignore
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_emai@mail.com')
    })

    // @ts-ignore
    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = await sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    // @ts-ignore
    test('Should return null if  LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })

    // @ts-ignore
    test('Should call HashComparer with correct values', async () => {
        const { sut, hashComparerStub } = makeSut()
        const loadSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    // @ts-ignore
    test('Should throw if HashComparer throws', async () => {
        const { sut, hashComparerStub} = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = await sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    // @ts-ignore
    test('Should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub} = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })

    // @ts-ignore
    test('Should call Encrypter with correct id', async () => {
        const { sut, encrypterGeneratorStub } = makeSut()
        const generateSpy = jest.spyOn(encrypterGeneratorStub, 'generate')
        await sut.auth(makeFakeAuthentication())
        expect(generateSpy).toHaveBeenCalledWith('any_id')
    })

    // @ts-ignore
    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterGeneratorStub } = makeSut()
        jest.spyOn(encrypterGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = await sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })

    // @ts-ignore
    test('Should call Encrypter with correct id', async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBe('any_token')
    })

    // @ts-ignore
    test('Should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(makeFakeAuthentication())
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
    })

    // @ts-ignore
    test('Should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = await sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
})