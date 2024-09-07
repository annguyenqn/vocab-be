import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-dto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/types/jwtPayload.type';
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
  verifyAccessToken(token: string): boolean {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new UnauthorizedException('Access token is invalid or expired');
    }
    return true;
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
}
