import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBidDto {
  @ApiProperty({ example: 15000, description: "Bid amount in BDT" })
  @IsInt()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({ example: "I am a BUET student, can move in July 1st" })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  message?: string;
}
