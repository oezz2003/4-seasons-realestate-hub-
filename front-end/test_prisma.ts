import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const devs = await prisma.developer.count();
  const comps = await prisma.compound.count();
  const locs = await prisma.location.count();
  const amens = await prisma.amenity.count();
  console.log(`Developers: ${devs}, Compounds: ${comps}, Locations: ${locs}, Amenities: ${amens}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
