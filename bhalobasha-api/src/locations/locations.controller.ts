import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('divisions')
  @ApiOperation({ summary: 'Get all divisions' })
  findDivisions() {
    return this.locationsService.findDivisions();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get districts by division' })
  @ApiQuery({ name: 'divisionId', type: Number, required: true })
  findDistricts(@Query('divisionId', ParseIntPipe) divisionId: number) {
    return this.locationsService.findDistricts(divisionId);
  }

  @Get('thanas')
  @ApiOperation({ summary: 'Get thanas by district' })
  @ApiQuery({ name: 'districtId', type: Number, required: true })
  findThanas(@Query('districtId', ParseIntPipe) districtId: number) {
    return this.locationsService.findThanas(districtId);
  }

  @Get('areas')
  @ApiOperation({ summary: 'Get areas by thana' })
  @ApiQuery({ name: 'thanaId', type: Number, required: true })
  findAreas(@Query('thanaId', ParseIntPipe) thanaId: number) {
    return this.locationsService.findAreas(thanaId);
  }
}
