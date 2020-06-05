import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able authenticate', async () => {
    const user = await createUser.execute({
      name: 'User 1',
      email: 'email@provider.com.br',
      password: '123123',
    });

    const response = await authUser.execute({
      email: 'email@provider.com.br',
      password: '123123',
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toEqual(user);
  });

  it('should not be able authenticate with non existing user', async () => {
    await expect(
      authUser.execute({
        email: 'other@provider.com.br',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'User 1',
      email: 'email@provider.com.br',
      password: '123123',
    });

    await expect(
      authUser.execute({
        email: 'email@provider.com.br',
        password: '321321aaaaa',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
