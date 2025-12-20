import prisma from "../src/lib/prisma";
import { faker } from "@faker-js/faker";

async function main() {
  const users = Array.from({ length: 100 }).map(() => ({
    phone: faker.phone.number(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    createdAt: faker.date.past({ years: 1 }),
  }));

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
