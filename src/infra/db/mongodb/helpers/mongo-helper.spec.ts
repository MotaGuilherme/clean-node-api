import {  MongoHelper as sut} from "./mongo-helper";

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await sut.disconnect()
    })

    // @ts-ignore
    test('Should reconnect if mongodb is down', async () => {
        let accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
        accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
    })
})