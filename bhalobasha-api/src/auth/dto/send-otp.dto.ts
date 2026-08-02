import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class SendOtpDto {
  @ApiPropertyOptional({ example: "01712345678" })
  @IsOptional()
  @IsString()
  @Matches(/^01[3-9]\d{8}$/, {
    message: "Phone must be a valid Bangladesh mobile number",
  })
  phone?: string;

  @ApiPropertyOptional({ example: "user@example.com" })
  @IsOptional()
  @IsEmail({}, { message: "Must be a valid email address" })
  email?: string;

  @ValidateIf((o) => !o.phone && !o.email)
  @IsNotEmpty({ message: "Either phone or email must be provided" })
  _atLeastOne?: never;
}
