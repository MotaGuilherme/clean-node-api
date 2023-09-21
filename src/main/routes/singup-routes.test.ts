import request from 'supertest'
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe('SingUp Routes', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async ()  => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany()
    })

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