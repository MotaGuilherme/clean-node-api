import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from "./db-add-account-protocols";


export class DbAddAccount implements AddAccount {

    constructor(private readonly encrypter: Hasher, private readonly addAccountRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword =   this.encrypter.encrypt(accountData.password)
        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
        return account
    }
}