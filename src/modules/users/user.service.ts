import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/util/helper';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { GetUsersQueryDto } from './dto/get-user.dto';
import { GetUsersResponseDto } from './dto/get-user-res.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  async findEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    return null;
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
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

  async getUsers(query: GetUsersQueryDto): Promise<GetUsersResponseDto> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.firstName', 'user.lastName'])
      .where('user.deletedAt IS NULL')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      data: users,
    };
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async removeUser(id: number): Promise<{ message: string }> {
    const user = await this.findUserById(id);
    user.deletedAt = new Date();
    await this.userRepository.save(user);
    return { message: 'User successfully deleted' };
  }
}
