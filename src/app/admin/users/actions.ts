"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const role = String(formData.get("role") || "MEMBER") as "ADMIN" | "MEMBER";

  if (!name || !email || !password) {
    throw new Error("Toate câmpurile sunt obligatorii.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Există deja un utilizator cu acest email.");
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") || "").trim();

  if (!userId) {
    throw new Error("Lipsește userId.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Utilizatorul nu există.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
}
