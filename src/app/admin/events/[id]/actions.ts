"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { sendInviteEmail } from "@/lib/email";

export async function sendRequest(formData: FormData) {
  await requireAdmin();

  const eventId = String(formData.get("eventId") || "").trim();
  const userId = String(formData.get("userId") || "").trim();
  const departmentId = String(formData.get("departmentId") || "").trim();

  if (!eventId || !userId || !departmentId) {
    throw new Error("Missing fields");
  }

  const existingRequest = await prisma.eventRequest.findFirst({
    where: {
      eventId,
      userId,
      departmentId,
    },
  });

  if (existingRequest) {
    throw new Error(
      "Request-ul există deja pentru userul și departamentul acesta.",
    );
  }

  await prisma.eventRequest.create({
    data: {
      eventId,
      userId,
      departmentId,
      status: "PENDING",
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (user && event && department) {
    await sendInviteEmail({
      to: user.email,
      eventTitle: event.title,
      date: new Date(event.date).toLocaleString("ro-RO"),
      role: department.name,
    });
  }

  revalidatePath(`/admin/events/${eventId}`);
}

export async function removeRequest(formData: FormData) {
  await requireAdmin();

  const requestId = String(formData.get("requestId") || "").trim();
  const eventId = String(formData.get("eventId") || "").trim();

  if (!requestId || !eventId) {
    throw new Error("Missing fields");
  }

  await prisma.eventRequest.delete({
    where: {
      id: requestId,
    },
  });

  revalidatePath(`/admin/events/${eventId}`);
}
