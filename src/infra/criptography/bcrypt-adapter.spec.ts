import bcrypt from 'bcrypt'
import { BcryptAdapter } from "./bcrypt-adapter";
describe('Bcrypter adapter', () => {
    // @ts-ignore
    test('Should call bcrypt with correct values', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
})