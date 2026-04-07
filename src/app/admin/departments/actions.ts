"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function createDepartment(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();

  if (!name) {
    throw new Error("Department name is required.");
  }

  const existingDepartment = await prisma.department.findUnique({
    where: { name },
  });

  if (existingDepartment) {
    throw new Error("Department already exists.");
  }

  await prisma.department.create({
    data: {
      name,
    },
  });

  revalidatePath("/admin/departments");
}

export async function updateDepartment(formData: FormData) {
  await requireAdmin();

  const departmentId = String(formData.get("departmentId") || "").trim();
  const name = String(formData.get("name") || "").trim();

  if (!departmentId || !name) {
    throw new Error("Missing fields.");
  }

  const existingDepartment = await prisma.department.findFirst({
    where: {
      name,
      NOT: {
        id: departmentId,
      },
    },
  });

  if (existingDepartment) {
    throw new Error("Another department with this name already exists.");
  }

  await prisma.department.update({
    where: { id: departmentId },
    data: { name },
  });

  revalidatePath("/admin/departments");
}

export async function deleteDepartment(formData: FormData) {
  await requireAdmin();

  const departmentId = String(formData.get("departmentId") || "").trim();

  if (!departmentId) {
    throw new Error("Missing departmentId.");
  }

  await prisma.userDepartment.deleteMany({
    where: { departmentId },
  });

  await prisma.department.delete({
    where: { id: departmentId },
  });

  revalidatePath("/admin/departments");
}
