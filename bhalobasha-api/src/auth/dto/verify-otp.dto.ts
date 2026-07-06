import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '01712345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Phone must be a valid Bangladesh mobile number',
  })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP code must contain only digits' })
  code: string;
}
