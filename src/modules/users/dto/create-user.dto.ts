import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;
}
