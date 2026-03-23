"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

function parseDateTimeLocal(value: string) {
  const [datePart, timePart] = value.split("T");

  if (!datePart || !timePart) {
    throw new Error("Dată invalidă.");
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, 0);
}

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const serviceType = String(formData.get("serviceType") || "").trim() as
    | "MORNING"
    | "EVENING";
  const notes = String(formData.get("notes") || "").trim();

  if (!title || !date || !serviceType) {
    throw new Error("Title, date și serviceType sunt obligatorii.");
  }

  const parsedDate = parseDateTimeLocal(date);

  await prisma.event.create({
    data: {
      title,
      date: parsedDate,
      serviceType,
      notes: notes || null,
    },
  });

  revalidatePath("/admin/events");
}
