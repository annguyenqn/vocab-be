import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class GetUsersResponseDto {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of users' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ type: [User], description: 'List of users' })
  data: User[];
}
