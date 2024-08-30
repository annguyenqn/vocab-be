import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/util/helper';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    return true;
  }
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
    const hashPass = await hashPassword(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashPass,
    });
    return this.userRepository.save(newUser);
  }

  findAll() {
    const a = '21231';
    return a;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
