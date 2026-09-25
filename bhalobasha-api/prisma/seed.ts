import { PrismaClient } from "@prisma/client";

import {
  getDivisions,
  getDistricts,
  getUpazilas,
  getAreas,
  getVillages,
} from "@olism/bd-geo";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Bangladesh geographical data...");

  console.log("Seeding divisions...");
  const divisions = getDivisions();

  await prisma.division.createMany({
    data: divisions,
  });

  console.log(`✓ ${divisions.length} divisions seeded`);

  console.log("Seeding districts...");
  const districts = getDistricts();

  await prisma.district.createMany({
    data: districts,
  });

  console.log(`✓ ${districts.length} districts seeded`);

  console.log("Seeding upazilas...");
  const upazilas = getUpazilas();

  await prisma.upazila.createMany({
    data: upazilas.map((ups) => ({
      ...ups,
      type: ups.type
        ? (ups.type.toUpperCase() as "UPAZILA" | "THANA")
        : "UPAZILA",
    })),
  });

  console.log(`✓ ${upazilas.length} upazilas seeded`);

  console.log("Seeding areas...");
  const areas = getAreas();

  await prisma.area.createMany({
    data: areas.map((area) => ({
      ...area,
      type: area.type.toUpperCase() as "UNION" | "WARD",
    })),
  });

  console.log(`✓ ${areas.length} areas seeded`);

  console.log("Seeding villages...");
  const villages = getVillages();

  await prisma.village.createMany({
    data: villages,
  });

  console.log(`✓ ${villages.length} villages seeded`);

  console.log("Bangladesh geographical data seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
