import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../infra/typeorm/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      name: 'User 1',
      email: 'email@provider.com.br',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
  });
  it('should not be able to create two users with the same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const email = 'email@provider.com';

    await createUser.execute({
      name: 'User 1',
      email,
      password: '123123',
    });

    expect(
      createUser.execute({
        name: 'User 1',
        email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
