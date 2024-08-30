import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../modules/users/entities/user.entity';
export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.password = faker.internet.password();
  return user;
});
