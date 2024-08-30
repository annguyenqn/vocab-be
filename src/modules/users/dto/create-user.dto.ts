import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({
    description: 'The email of the user',
    example: 'john_doe@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  lastName: string;
}
