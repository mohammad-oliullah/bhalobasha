import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Karim Ahmed' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'karim@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/demo/image/upload/photo.jpg' })
  @IsOptional()
  @IsUrl()
  profilePhoto?: string;
}
