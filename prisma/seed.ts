import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const userPassword = await bcrypt.hash("user1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@biserica.ro" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@biserica.ro",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@biserica.ro" },
    update: {},
    create: {
      name: "Test User",
      email: "user@biserica.ro",
      password: userPassword,
      role: "MEMBER",
    },
  });

  const baseDepartments = [
    "Solist",
    "Pian",
    "Chitara",
    "Media",
    "Sunet",
    "Coffee",
    "Start",
  ];

  for (const name of baseDepartments) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
