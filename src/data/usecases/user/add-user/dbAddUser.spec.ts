import { ICreateTokenRepository, ICreateUserRepository, IFindUserByEmailRepository, IGenerateCrypto, IHasher } from "@/data/protocols";
import { mockHasher } from "@/data/__mocks__/bcrypt.mock";
import { mockCryptoAdapter } from "@/data/__mocks__/crypto.mock";
import { mockTokenCreateRepository } from "@/data/__mocks__/token.mock";
import { MockUserCreateRepository, MockUserFindByEmailRepository } from "@/data/__mocks__/user.mock";
import { DbAddUser } from "./dbAddUser";

let dbAddUser: DbAddUser
let cryptoAdapter: IGenerateCrypto
let userFindByEmailRepository: IFindUserByEmailRepository
let userCreateRepository: ICreateUserRepository
let tokenRepository: ICreateTokenRepository
let bcryptAdapter: IHasher

describe('DbAddUser  Data', () => {
  beforeEach(() => {
    cryptoAdapter = mockCryptoAdapter()
    userFindByEmailRepository = MockUserFindByEmailRepository()
    userCreateRepository = MockUserCreateRepository()
    tokenRepository = mockTokenCreateRepository()
    bcryptAdapter = mockHasher()
    dbAddUser = new DbAddUser(
      cryptoAdapter,
      userFindByEmailRepository,
      userCreateRepository ,
      tokenRepository,
      bcryptAdapter
    )
  })

  it('should be defined', () => {
    expect(dbAddUser).toBeDefined()
  })

  it('should be able to call UserRepository with success', async () => {
    const res = jest.spyOn(userCreateRepository, 'create')

    await dbAddUser.add({
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'password'
    })

    expect(res).toHaveBeenCalledWith({
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'hashed_password'
    })
  })

  it('returns null if already has a user with email passed on request', async () => {
    jest.spyOn(userFindByEmailRepository, 'findEmail').mockResolvedValue({
      id: 1,
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'hashed_password'
    })

    const res = await dbAddUser.add({
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'password'
    })

    expect(res).toBeNull()

  })

  it('should be generate a token', async () => {
    const res =  cryptoAdapter.generate(16)

    expect(res).toBe('TOKEN_GENERATED')
  })

  it('should be able to call createTokenRepo with success', async () => {
    const res = jest.spyOn(tokenRepository, 'create')

    await dbAddUser.add({
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'password'
    })

    expect(res).toHaveBeenCalledWith({
      token: 'TOKEN_GENERATED',
      user_id: 1
    })
  })

  it('throw an Error if tokenRepository create throws', async () => {
    jest.spyOn(tokenRepository, 'create').mockRejectedValue(new Error())

    const promise =  dbAddUser.add({
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'password'
    })

    await expect(promise).rejects.toThrow()

  })

  it('throw an Error if userRepository loadByEmail throws', async () => {
    jest.spyOn(userCreateRepository, 'create').mockRejectedValue(new Error())

    const promise =  dbAddUser.add({
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'password'
    })

    await expect(promise).rejects.toThrow()

  })

  it('throw an Error if userRepository loadByEmail throws', async () => {
    jest.spyOn(userFindByEmailRepository, 'findEmail').mockRejectedValue(new Error())

    const promise =  dbAddUser.add({
      email: 'user@mail.com',
      name: 'name',
      password_hash: 'password'
    })

    await expect(promise).rejects.toThrow()

  })
});
