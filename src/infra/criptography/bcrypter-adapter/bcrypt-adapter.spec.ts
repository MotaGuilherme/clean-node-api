import bcrypt from 'bcrypt'
import { BcryptAdapter } from "./bcrypt-adapter";


jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    },
    async compare (): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}))

const salt = 12
const makeSut = (): BcryptAdapter  => {
    return new BcryptAdapter(salt)
}

describe('Bcrypter adapter', () => {

    // @ts-ignore
    test('Should call hash with correct values', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    // @ts-ignore
    test('Should return a valid hash on hash success', async () => {
        const sut = makeSut()
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('hash')
    })

    // @ts-ignore
    test('Should throw if bcrypt throws', async () => {
        const sut = makeSut()
        // @ts-ignore
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.encrypt('any_value')
        await expect(promise).rejects.toThrow()
    })

    // @ts-ignore
    test('Should call compare with correct values', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    // @ts-ignore
    test('Should return true when compare succeeds', async () => {
        const sut = makeSut()
        const isValid = await sut.compare('any_value', 'any_hash')
        expect(isValid).toBe(true)
    })

    // @ts-ignore
    // test('Should false when compare fails', async () => {
    //     const sut = makeSut()
    //     jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
    //         throw new Error()
    //     })
    //     const isValid = await sut.compare('any_value', 'any_hash')
    //     expect(isValid).toBe(false)
    // })

    // @ts-ignore
    test('Should throw if compare throws', async () => {
        const sut = makeSut()
        // @ts-ignore
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.compare('any_value', 'any_hash')
        await expect(promise).rejects.toThrow()
    })
})