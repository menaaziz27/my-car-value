import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test123@test.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use ', async () => {
    await service.signup('test@test.com', 'asdfasdd');
    await expect(
      service.signup('test@test.com', 'asdfs'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws an error if signin is called with an unused email', async () => {
    await expect(
      service.signin('email@email.com', 'asdf'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws if invalid passowrd is provided', async () => {
    await service.signup('anyemail@test.com', 'differentpassword');
    await expect(
      service.signin('anyemail@test.com', 'password'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('it signin the user if the credentials are valid', async () => {
    await service.signup('email@email.com', 'asdf');
    await expect(service.signin('email@email.com', 'asdf')).toBeDefined();
  });

  it('it returns a user if a valid passowrd is provided', async () => {
    const createdUser = await service.signup('any@any.com', 'mypassword');
    const user = await service.signin('any@any.com', 'mypassword');
    expect(user).toBeDefined();
    expect(user.password).toBe(createdUser.password);
  });
});
