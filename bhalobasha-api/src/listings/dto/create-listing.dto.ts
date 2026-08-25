import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  ArrayMaxSize,
  IsNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  GenderPreference,
  ListingStatus,
  ListingType,
  TenantPolicy,
} from "@prisma/client";

export const MAX_LISTING_PHOTOS = 8;

export class CreateListingDto {
  @ApiProperty({ example: "Spacious 2BHK Flat in Mirpur" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: "Well-maintained flat near main road with 24/7 security.",
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ enum: ListingType })
  @IsEnum(ListingType)
  type!: ListingType;

  @ApiProperty({ enum: TenantPolicy })
  @IsEnum(TenantPolicy)
  tenantPolicy!: TenantPolicy;

  @ApiProperty({ enum: GenderPreference })
  @IsEnum(GenderPreference)
  genderPreference!: GenderPreference;

  @ApiProperty({ example: 15000 })
  @IsInt()
  @Min(0)
  rent!: number;

  @ApiPropertyOptional({ example: 30000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  advanceAmount?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  negotiable!: boolean;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalRooms?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalBaths?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  floor?: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  isFurnished!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  utilitiesIncluded!: boolean;

  @ApiProperty({ example: "2026-07-01T00:00:00.000Z" })
  @IsDateString()
  availableFrom!: string;

  @ApiPropertyOptional({ enum: ListingStatus, default: ListingStatus.DRAFT })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiProperty({ example: "01712345678" })
  @IsString()
  @Matches(/^01[3-9]\d{8}$/, {
    message: "Contact phone must be a valid Bangladesh mobile number",
  })
  contactPhone!: string;

  @ApiProperty({ example: "House 5, Road 12, Block A, Mirpur-10, Dhaka" })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  areaId!: number;

  @ApiPropertyOptional({
    example: [
      "https://res.cloudinary.com/demo/image/upload/v123/photo1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v123/photo2.jpg",
    ],
    description: "Cloudinary URLs from POST /media/upload",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_LISTING_PHOTOS, {
    message: "A listing can have a maximum of 8 photos",
  })
  @IsUrl({}, { each: true })
  photos?: string[];

  @ApiPropertyOptional({ description: "Enable bidding on this listing" })
  @IsOptional()
  @IsBoolean()
  isBiddingEnabled?: boolean;

  @ApiPropertyOptional({ description: "Minimum bid amount in BDT" })
  @IsOptional()
  @IsInt()
  @Min(1)
  minimumBid?: number;

  @ApiPropertyOptional({ description: "Bidding deadline datetime" })
  @IsOptional()
  @IsDateString()
  biddingDeadline?: string;

  @ApiPropertyOptional({ example: 23.7891 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 90.4126 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
