import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

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

  @ApiPropertyOptional({ example: "123456" })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  code!: string;

  @ApiPropertyOptional({
    example: true,
    description: "Demo bypass for recruiter testing",
  })
  @IsOptional()
  @IsBoolean()
  isDemoLogin?: boolean;

  @ValidateIf((o) => !o.phone && !o.email)
  @IsNotEmpty({ message: "Either phone or email must be provided" })
  _atLeastOne?: never;
}
