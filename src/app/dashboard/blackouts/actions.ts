"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createBlackout(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const date = String(formData.get("date") || "").trim();
  const serviceType = String(formData.get("serviceType") || "").trim() as
    | "MORNING"
    | "EVENING"
    | "ALL_DAY";
  const note = String(formData.get("note") || "").trim();

  if (!date || !serviceType) {
    throw new Error("Date și service type sunt obligatorii.");
  }

  await prisma.blackout.create({
    data: {
      userId: session.user.id,
      date: new Date(`${date}T12:00:00`),
      serviceType,
      note: note || null,
    },
  });

  revalidatePath("/dashboard/blackouts");
}

export async function deleteBlackout(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const blackoutId = String(formData.get("blackoutId") || "").trim();

  if (!blackoutId) {
    throw new Error("Missing blackoutId");
  }

  const blackout = await prisma.blackout.findUnique({
    where: { id: blackoutId },
  });

  if (!blackout) {
    throw new Error("Blackout not found");
  }

  if (blackout.userId !== session.user.id) {
    throw new Error("Not allowed");
  }

  await prisma.blackout.delete({
    where: { id: blackoutId },
  });

  revalidatePath("/dashboard/blackouts");
}
