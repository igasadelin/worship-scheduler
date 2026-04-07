"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "").trim();
  const role = String(formData.get("role") || "MEMBER") as "ADMIN" | "MEMBER";
  const departmentIds = formData.getAll("departments").map(String);

  if (!userId || !name || !email) {
    throw new Error("Missing required fields.");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: userId,
      },
    },
  });

  if (existingUser) {
    throw new Error("Există deja un utilizator cu acest email.");
  }

  const data: {
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
    password?: string;
  } = {
    name,
    email,
    role,
  };

  if (password) {
    data.password = await hashPassword(password);
  }

  await prisma.user.update({
    where: { id: userId },
    data,
  });

  await prisma.userDepartment.deleteMany({
    where: { userId },
  });

  if (departmentIds.length > 0) {
    await prisma.userDepartment.createMany({
      data: departmentIds.map((departmentId) => ({
        userId,
        departmentId,
      })),
    });
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}/edit`);
  redirect("/admin/users");
}
