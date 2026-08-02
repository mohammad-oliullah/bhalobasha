import { IsEmail, IsOptional, IsString, IsUrl, Matches } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "01643616707" })
  @IsOptional()
  @IsString()
  @Matches(/^01[3-9]\d{8}$/, {
    message: "Phone must be a valid Bangladesh mobile number",
  })
  phone?: string;

  @ApiPropertyOptional({ example: "Karim Ahmed" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "karim@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: "https://res.cloudinary.com/demo/image/upload/photo.jpg",
  })
  @IsOptional()
  @IsUrl()
  profilePhoto?: string;
}
