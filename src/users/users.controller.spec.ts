import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'email@test.com',
          password: 'pass',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdfgh' } as User]);
      },
      // remove: () => Promise.resolve(null),
      // update: () => Promise.resolve({} as User),
    };

    fakeAuthService = {
      signup: () => Promise.resolve({} as User),
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users with a given email and return a list of users that has one entry', async () => {
    const users = await controller.findAllUsers('mena@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('mena@test.com');
  });

  it('find a user with a given id and return founded user', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('find a user with a non existing id throws an error', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);

    await expect(controller.findUser('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('sigin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'mina@gmail.com', password: 'asdfg' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(user.id);
  });
});
