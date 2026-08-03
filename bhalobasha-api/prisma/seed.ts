import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const divisions = [
    { name: "Barishal", nameBn: "বরিশাল" },
    { name: "Chattogram", nameBn: "চট্টগ্রাম" },
    { name: "Dhaka", nameBn: "ঢাকা" },
    { name: "Khulna", nameBn: "খুলনা" },
    { name: "Mymensingh", nameBn: "ময়মনসিংহ" },
    { name: "Rajshahi", nameBn: "রাজশাহী" },
    { name: "Rangpur", nameBn: "রংপুর" },
    { name: "Sylhet", nameBn: "সিলেট" },
  ];

  for (const division of divisions) {
    await prisma.division.upsert({
      where: { id: divisions.indexOf(division) + 1 },
      update: division,
      create: { id: divisions.indexOf(division) + 1, ...division },
    });
  }

  const dhakaDivisionId = 3;

  const dhakaDistricts = [
    { name: "Dhaka", nameBn: "ঢাকা" },
    { name: "Faridpur", nameBn: "ফরিদপুর" },
    { name: "Gazipur", nameBn: "গাজীপুর" },
    { name: "Gopalganj", nameBn: "গোপালগঞ্জ" },
    { name: "Kishoreganj", nameBn: "কিশোরগঞ্জ" },
    { name: "Madaripur", nameBn: "মাদারীপুর" },
    { name: "Manikganj", nameBn: "মানিকগঞ্জ" },
    { name: "Munshiganj", nameBn: "মুন্সীগঞ্জ" },
    { name: "Narayanganj", nameBn: "নারায়ণগঞ্জ" },
    { name: "Narsingdi", nameBn: "নরসিংদী" },
    { name: "Rajbari", nameBn: "রাজবাড়ী" },
    { name: "Shariatpur", nameBn: "শরীয়তপুর" },
    { name: "Tangail", nameBn: "টাঙ্গাইল" },
  ];

  const districtRecords: { id: number; name: string }[] = [];
  for (let i = 0; i < dhakaDistricts.length; i++) {
    const district = await prisma.district.upsert({
      where: { id: i + 1 },
      update: { ...dhakaDistricts[i], divisionId: dhakaDivisionId },
      create: { id: i + 1, ...dhakaDistricts[i], divisionId: dhakaDivisionId },
    });
    districtRecords.push(district);
  }

  const dhakaDistrict = districtRecords.find((d) => d.name === "Dhaka")!;

  const thanas = [
    { name: "Mirpur", nameBn: "মিরপুর" },
    { name: "Mohammadpur", nameBn: "মোহাম্মদপুর" },
    { name: "Dhanmondi", nameBn: "ধানমন্ডি" },
    { name: "Uttara", nameBn: "উত্তরা" },
    { name: "Gulshan", nameBn: "গুলশান" },
    { name: "Banani", nameBn: "বনানী" },
    { name: "Tejgaon", nameBn: "তেজগাঁও" },
    { name: "Motijheel", nameBn: "মতিঝিল" },
    { name: "Wari", nameBn: "ওয়ারী" },
  ];

  const thanaRecords: { id: number; name: string }[] = [];
  for (let i = 0; i < thanas.length; i++) {
    const thana = await prisma.thana.upsert({
      where: { id: i + 1 },
      update: { ...thanas[i], districtId: dhakaDistrict.id },
      create: { id: i + 1, ...thanas[i], districtId: dhakaDistrict.id },
    });
    thanaRecords.push(thana);
  }

  const mirpurThana = thanaRecords.find((t) => t.name === "Mirpur")!;
  const mohammadpurThana = thanaRecords.find((t) => t.name === "Mohammadpur")!;

  const areas = [
    { name: "Mirpur-10", nameBn: "মিরপুর-১০", thanaId: mirpurThana.id },
    { name: "Mirpur-1", nameBn: "মিরপুর-১", thanaId: mirpurThana.id },
    { name: "Pallabi", nameBn: "পল্লবী", thanaId: mirpurThana.id },
    { name: "Kazipara", nameBn: "কাজীপাড়া", thanaId: mirpurThana.id },
    { name: "Shyamoli", nameBn: "শ্যামলী", thanaId: mohammadpurThana.id },
    {
      name: "Tajmahal Road",
      nameBn: "তাজমহল রোড",
      thanaId: mohammadpurThana.id,
    },
    { name: "Adabor", nameBn: "আদাবর", thanaId: mohammadpurThana.id },
  ];

  for (let i = 0; i < areas.length; i++) {
    await prisma.area.upsert({
      where: { id: i + 1 },
      update: areas[i],
      create: { id: i + 1, ...areas[i] },
    });
  }

  console.log("Seed completed successfully.");
  console.log(
    `${divisions.length} divisions, ${dhakaDistricts.length} districts, ${thanas.length} thanas, ${areas.length} areas seeded.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
