import { ArrayMinSize, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPhotosDto {
  @ApiProperty({
    example: [
      'https://res.cloudinary.com/demo/image/upload/v123/photo1.jpg',
      'https://res.cloudinary.com/demo/image/upload/v123/photo2.jpg',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  urls: string[];
}
