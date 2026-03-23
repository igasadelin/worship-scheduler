import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/navbar";

export default async function UserEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      requests: {
        where: {
          status: "ACCEPTED",
        },
        include: {
          user: true,
        },
        orderBy: {
          ministryRole: "asc",
        },
      },
    },
  });

  if (!event) return notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <Navbar />
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-3">{event.title}</h1>

        <p className="text-zinc-400 mb-2">
          {new Date(event.date).toLocaleString("ro-RO")} • {event.serviceType}
        </p>

        {event.notes && <p className="text-zinc-300 mb-8">{event.notes}</p>}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold mb-4">Confirmed lineup</h2>

          <div className="space-y-3">
            {event.requests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-green-700/40 bg-zinc-950 p-4"
              >
                <p className="font-semibold">
                  {request.ministryRole}: {request.user.name}
                </p>
                <p className="text-sm text-zinc-400">{request.user.email}</p>
              </div>
            ))}

            {event.requests.length === 0 && (
              <p className="text-zinc-400">Nu există membri confirmați încă.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
