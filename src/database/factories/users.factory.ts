import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../modules/users/entities/user.entity';
export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.userName = faker.internet.userName();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.password = faker.internet.password();
  return user;
});
