import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  createAccessToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  createRefreshToken(userId: number, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email ');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
  async login(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.createAccessToken(user.id, user.email);
    const refreshToken = this.createRefreshToken(user.id, user.email);
    return { accessToken, refreshToken };
  }
}
