import {
  GenderPreference,
  ListingStatus,
  ListingType,
  PrismaClient,
  TenantPolicy,
  UserRole,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const divisions = [
    { name: 'Barishal', nameBn: 'বরিশাল' },
    { name: 'Chattogram', nameBn: 'চট্টগ্রাম' },
    { name: 'Dhaka', nameBn: 'ঢাকা' },
    { name: 'Khulna', nameBn: 'খুলনা' },
    { name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
    { name: 'Rajshahi', nameBn: 'রাজশাহী' },
    { name: 'Rangpur', nameBn: 'রংপুর' },
    { name: 'Sylhet', nameBn: 'সিলেট' },
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
    { name: 'Dhaka', nameBn: 'ঢাকা' },
    { name: 'Faridpur', nameBn: 'ফরিদপুর' },
    { name: 'Gazipur', nameBn: 'গাজীপুর' },
    { name: 'Gopalganj', nameBn: 'গোপালগঞ্জ' },
    { name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ' },
    { name: 'Madaripur', nameBn: 'মাদারীপুর' },
    { name: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
    { name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ' },
    { name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
    { name: 'Narsingdi', nameBn: 'নরসিংদী' },
    { name: 'Rajbari', nameBn: 'রাজবাড়ী' },
    { name: 'Shariatpur', nameBn: 'শরীয়তপুর' },
    { name: 'Tangail', nameBn: 'টাঙ্গাইল' },
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

  const dhakaDistrict = districtRecords.find((d) => d.name === 'Dhaka')!;

  const thanas = [
    { name: 'Mirpur', nameBn: 'মিরপুর' },
    { name: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
    { name: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
    { name: 'Uttara', nameBn: 'উত্তরা' },
    { name: 'Gulshan', nameBn: 'গুলশান' },
    { name: 'Banani', nameBn: 'বনানী' },
    { name: 'Tejgaon', nameBn: 'তেজগাঁও' },
    { name: 'Motijheel', nameBn: 'মতিঝিল' },
    { name: 'Wari', nameBn: 'ওয়ারী' },
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

  const mirpurThana = thanaRecords.find((t) => t.name === 'Mirpur')!;
  const mohammadpurThana = thanaRecords.find((t) => t.name === 'Mohammadpur')!;

  const areas = [
    { name: 'Mirpur-10', nameBn: 'মিরপুর-১০', thanaId: mirpurThana.id },
    { name: 'Mirpur-1', nameBn: 'মিরপুর-১', thanaId: mirpurThana.id },
    { name: 'Pallabi', nameBn: 'পল্লবী', thanaId: mirpurThana.id },
    { name: 'Kazipara', nameBn: 'কাজীপাড়া', thanaId: mirpurThana.id },
    { name: 'Shyamoli', nameBn: 'শ্যামলী', thanaId: mohammadpurThana.id },
    { name: 'Tajmahal Road', nameBn: 'তাজমহল রোড', thanaId: mohammadpurThana.id },
    { name: 'Adabor', nameBn: 'আদাবর', thanaId: mohammadpurThana.id },
  ];

  const areaRecords: { id: number; name: string }[] = [];
  for (let i = 0; i < areas.length; i++) {
    const area = await prisma.area.upsert({
      where: { id: i + 1 },
      update: areas[i],
      create: { id: i + 1, ...areas[i] },
    });
    areaRecords.push(area);
  }

  const adminUser = await prisma.user.upsert({
    where: { phone: '01700000000' },
    update: {
      name: 'Admin User',
      role: UserRole.ADMIN,
      isVerified: true,
    },
    create: {
      phone: '01700000000',
      name: 'Admin User',
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { phone: '01700000001' },
    update: {
      name: 'Rahim Uddin',
      role: UserRole.OWNER,
      isVerified: true,
    },
    create: {
      phone: '01700000001',
      name: 'Rahim Uddin',
      role: UserRole.OWNER,
      isVerified: true,
    },
  });

  const mirpur10 = areaRecords.find((a) => a.name === 'Mirpur-10')!;
  const shyamoli = areaRecords.find((a) => a.name === 'Shyamoli')!;
  const pallabi = areaRecords.find((a) => a.name === 'Pallabi')!;

  const existingListings = await prisma.listing.count({
    where: { ownerId: ownerUser.id },
  });

  if (existingListings === 0) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    await prisma.listing.create({
      data: {
        title: 'Spacious 2BHK Flat in Mirpur-10',
        description:
          'A well-maintained 2 bedroom flat near Mirpur-10 circle. Close to bus stand, markets, and schools. 24/7 security with lift.',
        type: ListingType.FULL_FLAT,
        tenantPolicy: TenantPolicy.FAMILY_ONLY,
        genderPreference: GenderPreference.ANY,
        rent: 18000,
        advanceAmount: 36000,
        negotiable: true,
        totalRooms: 2,
        totalBaths: 2,
        floor: 5,
        isFurnished: false,
        utilitiesIncluded: false,
        availableFrom: new Date(),
        status: ListingStatus.ACTIVE,
        contactPhone: '01700000001',
        address: 'House 12, Road 5, Block C, Mirpur-10, Dhaka',
        areaId: mirpur10.id,
        ownerId: ownerUser.id,
        expiresAt,
        photos: {
          create: [
            {
              url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
              isPrimary: true,
            },
          ],
        },
      },
    });

    await prisma.listing.create({
      data: {
        title: 'Bachelor Seat near Shyamoli',
        description:
          'Clean shared apartment with WiFi, kitchen access, and weekly cleaning. Ideal for working professionals and students.',
        type: ListingType.SHARED_SEAT,
        tenantPolicy: TenantPolicy.BACHELOR_ONLY,
        genderPreference: GenderPreference.MALE,
        rent: 5500,
        advanceAmount: 11000,
        negotiable: false,
        isFurnished: true,
        utilitiesIncluded: true,
        availableFrom: new Date(),
        status: ListingStatus.ACTIVE,
        contactPhone: '01700000001',
        address: 'Flat 4B, Shyamoli Square, Mohammadpur, Dhaka',
        areaId: shyamoli.id,
        ownerId: ownerUser.id,
        expiresAt,
        photos: {
          create: [
            {
              url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
              isPrimary: true,
            },
          ],
        },
      },
    });

    await prisma.listing.create({
      data: {
        title: 'Student Mess in Pallabi',
        description:
          'Affordable mess accommodation with 3 meals daily. Walking distance from BUET and nearby coaching centers.',
        type: ListingType.MESS,
        tenantPolicy: TenantPolicy.STUDENT_ONLY,
        genderPreference: GenderPreference.ANY,
        rent: 4500,
        negotiable: true,
        isFurnished: true,
        utilitiesIncluded: true,
        availableFrom: new Date(),
        status: ListingStatus.ACTIVE,
        contactPhone: '01700000001',
        address: 'Pallabi Main Road, Mirpur, Dhaka',
        areaId: pallabi.id,
        ownerId: ownerUser.id,
        expiresAt,
        photos: {
          create: [
            {
              url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  console.log('Seed completed successfully.');
  console.log(`Admin user: ${adminUser.phone}`);
  console.log(`Owner user: ${ownerUser.phone}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
