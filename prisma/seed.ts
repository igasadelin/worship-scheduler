import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/passwords";

async function main() {
  const adminEmail = "admin@biserica.ro";
  const userEmail = "user@biserica.ro";

  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: "Adelin Admin",
        email: adminEmail,
        password: await hashPassword("admin1234"),
        role: "ADMIN",
      },
    });

    console.log("Admin created:");
    console.log("Email:", adminEmail);
    console.log("Password:", "admin1234");
  } else {
    console.log("Admin already exists.");
  }

  const userExists = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!userExists) {
    await prisma.user.create({
      data: {
        name: "Test User",
        email: userEmail,
        password: await hashPassword("user1234"),
        role: "MEMBER",
      },
    });

    console.log("User created:");
    console.log("Email:", userEmail);
    console.log("Password:", "user1234");
  } else {
    console.log("User already exists.");
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
