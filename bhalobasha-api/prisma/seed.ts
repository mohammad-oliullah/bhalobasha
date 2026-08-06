import { PrismaClient } from "@prisma/client";
import divisions from "./data/divisions.json";
import districts from "./data/districts.json";
import thanas from "./data/thanas.json";
import areas from "./data/areas.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Seeding divisions...");
  for (const d of divisions) {
    await prisma.division.upsert({
      where: { id: d.id },
      update: { name: d.name, nameBn: d.nameBn },
      create: d,
    });
  }
  console.log(`✅ ${divisions.length} divisions`);

  console.log("🏙️ Seeding districts...");
  for (const d of districts) {
    await prisma.district.upsert({
      where: { id: d.id },
      update: { name: d.name, nameBn: d.nameBn, divisionId: d.divisionId },
      create: d,
    });
  }
  console.log(`✅ ${districts.length} districts`);

  console.log("🏘️ Seeding thanas...");
  for (const t of thanas) {
    await prisma.thana.upsert({
      where: { id: t.id },
      update: { name: t.name, nameBn: t.nameBn, districtId: t.districtId },
      create: t,
    });
  }
  console.log(`✅ ${thanas.length} thanas`);

  console.log("📍 Seeding areas...");
  for (const a of areas) {
    await prisma.area.upsert({
      where: { id: a.id },
      update: { name: a.name, nameBn: a.nameBn, thanaId: a.thanaId },
      create: a,
    });
  }
  console.log(`✅ ${areas.length} areas`);

  console.log("\n🎉 Seed completed!");
  console.log(`   ${divisions.length} divisions`);
  console.log(`   ${districts.length} districts`);
  console.log(`   ${thanas.length} thanas`);
  console.log(`   ${areas.length} areas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
