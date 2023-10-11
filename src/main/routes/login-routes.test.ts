import request from 'supertest'
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";
import { hash } from "bcrypt";


let accountCollection: Collection

describe('SingUp Routes', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async ()  => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany()
    })

    describe('POST /signup', () =>  {

    // @ts-ignore
    test('Should return 200 on signup', async () => {
        const password = await hash('123', 12)
        await accountCollection.insertOne({
            name: 'name',
            email: 'email@mail.com',
            password
        })
        await request(app)
            .post('/api/signup')
            .send({
                email: 'teste@gmail.com',
                password: '123',
            })
            .expect(200)
    })
})
})
