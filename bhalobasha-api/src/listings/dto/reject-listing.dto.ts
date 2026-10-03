import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class RejectListingDto {
  @ApiProperty({
    description: "Reason the listing does not meet moderation requirements",
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: "Rejection reason cannot be blank" })
  @MaxLength(1000)
  reason!: string;
}
