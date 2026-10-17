import { Type } from "class-transformer";
import { IsInt, IsString, Length, Max, Min } from "class-validator";

export class CreateCheckoutDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3650)
  durationDays!: number;

  @IsString()
  @Length(1, 200)
  address!: string;

  @IsString()
  @Length(1, 100)
  city!: string;

  @IsString()
  @Length(1, 20)
  postcode!: string;
}
