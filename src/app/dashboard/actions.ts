"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const requestId = String(formData.get("requestId"));
  const status = String(formData.get("status")) as "ACCEPTED" | "DECLINED";

  const request = await prisma.eventRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.userId !== session.user.id) {
    throw new Error("Not allowed");
  }

  await prisma.eventRequest.update({
    where: { id: requestId },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/events");
}
