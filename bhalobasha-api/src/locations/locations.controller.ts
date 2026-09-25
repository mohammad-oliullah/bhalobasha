import { Controller, Get, Query, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { LocationsService } from "./locations.service";

@ApiTags("Locations")
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get("divisions")
  @ApiOperation({ summary: "Get all divisions" })
  findDivisions() {
    return this.locationsService.findDivisions();
  }

  @Get("districts")
  @ApiOperation({ summary: "Get districts by division" })
  @ApiQuery({ name: "divisionId", type: Number, required: true })
  findDistricts(@Query("divisionId", ParseIntPipe) divisionId: number) {
    return this.locationsService.findDistricts(divisionId);
  }

  @Get("upazilas")
  @ApiOperation({ summary: "Get upazilas by district" })
  @ApiQuery({ name: "districtId", type: Number, required: true })
  findUpazilas(@Query("districtId", ParseIntPipe) districtId: number) {
    return this.locationsService.findUpazilas(districtId);
  }

  @Get("areas")
  @ApiOperation({ summary: "Get areas by upazila" })
  @ApiQuery({ name: "upazilaId", type: Number, required: true })
  findAreas(@Query("upazilaId", ParseIntPipe) upazilaId: number) {
    return this.locationsService.findAreas(upazilaId);
  }
}
