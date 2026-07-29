import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BidStatus } from "@prisma/client";

export class UpdateBidStatusDto {
  @ApiProperty({ enum: BidStatus })
  @IsEnum(BidStatus)
  status!: BidStatus;
}
