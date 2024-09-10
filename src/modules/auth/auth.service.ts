import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/types/jwtPayload.type';
import { SignUpDto } from './dto/signup.dto';
import { RoleName } from '../../common/enums/role-name.enum';

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
  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { email, password, firstName, lastName } = signUpDto;
    const existingUser = await this.usersService.findEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.usersService.findEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email ');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    const accessToken = this.createAccessToken(user.id, user.email);
    const refreshToken = this.createRefreshToken(user.id, user.email);
    return { accessToken, refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      ) as string | JwtPayload;
      const user = await this.usersService.findEmail(
        (decoded as JwtPayload).email,
      );
      const newAccessToken = this.createAccessToken(user.id, user.email);
      const newRefreshToken = this.createRefreshToken(user.id, user.email);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token is invalid or expired',
        error,
      );
    }
  }
  async assignRole(userId: number, roleName: RoleName): Promise<void> {
    await this.usersService.addRole(userId, roleName);
  }
}
