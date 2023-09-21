import request from 'supertest'
import app from "../config/app";

describe('SingUp Routes', () => {

    // @ts-ignore
    test('Should return an account on success', async () => {
        await request(app)
            .post('/api/singup')
            .send({
                name: 'Teste',
                email: 'teste@gmail.com',
                password: '123',
                passwordConfirmation: '123'
            })
            .expect(200)
    })
})