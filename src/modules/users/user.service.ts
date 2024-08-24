import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/util/helper';
@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const hashPass = await hashPassword(createUserDto.password);
    return hashPass;
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
