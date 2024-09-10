import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/users/entities/role.entity';
import { RoleName } from '../../common/enums/role-name.enum';
import * as bcrypt from 'bcryptjs';
export const UsersFactory = setSeederFactory(User, async (faker: Faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.password = await bcrypt.hash(faker.internet.password(), 10);

  const role = new Role();
  role.roleName = RoleName.USER;
  user.roles = [role];

  return user;
});
