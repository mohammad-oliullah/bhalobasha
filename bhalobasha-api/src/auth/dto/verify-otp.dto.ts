import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Length,
  ValidateIf,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class VerifyOtpDto {
  @ApiPropertyOptional({ example: "01712345678" })
  @IsOptional()
  @IsString()
  @Matches(/^01[3-9]\d{8}$/, {
    message: "Phone must be a valid Bangladesh mobile number",
  })
  phone?: string;

  @ApiPropertyOptional({ example: "user@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "123456" })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  code!: string;

  @ValidateIf((o) => !o.phone && !o.email)
  @IsNotEmpty({ message: "Either phone or email must be provided" })
  _atLeastOne?: never;
}
