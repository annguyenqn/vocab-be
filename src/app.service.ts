import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    const dbHost = this.configService.get<string>('DATABASE_NAME');
    return `Database host is ${dbHost}`;
  }
}
