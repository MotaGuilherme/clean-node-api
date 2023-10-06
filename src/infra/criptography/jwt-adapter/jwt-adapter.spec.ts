import jwt from 'jsonwebtoken'
import { JwtAdapter } from "./jwt-adapter";

describe('Jwt Adapter', () => {

    // @ts-ignore
    test('Should call sign correct values', async () => {
        const sut = new JwtAdapter('secret')
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.generate('any_id')
        expect(signSpy).toHaveBeenCalledWith({id: 'any_id'}, 'secret')
    })
})