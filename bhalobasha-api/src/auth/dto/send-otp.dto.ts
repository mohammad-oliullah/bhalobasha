import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '01712345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Phone must be a valid Bangladesh mobile number',
  })
  phone: string;
}
