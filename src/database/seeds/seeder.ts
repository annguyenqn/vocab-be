import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/users/entities/role.entity';
import { RoleName } from '../../common/enums/role-name.enum';
import * as bcrypt from 'bcryptjs';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(User);
    const roleRepository = dataSource.getRepository(Role);

    const adminRole = await roleRepository.save(
      roleRepository.create({ roleName: RoleName.ADMIN }),
    );
    const userRole = await roleRepository.save(
      roleRepository.create({ roleName: RoleName.USER }),
    );

    const adminUser = new User();
    adminUser.email = 'admin@gmail.com';
    adminUser.firstName = 'Admin';
    adminUser.lastName = 'User';
    adminUser.password = await bcrypt.hash('admin', 10);
    adminUser.roles = [adminRole];
    await dataSource.getRepository(User).save(adminUser);

    const users = await userFactory.saveMany(30);

    for (const user of users) {
      user.roles = [userRole];
      await dataSource.getRepository(User).save(user);
    }
  }
}
