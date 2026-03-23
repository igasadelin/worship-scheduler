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
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div className="glass-card" style={{ padding: 24 }}>
          <h1
            className="hero-title"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
          >
            {event.title}
          </h1>

          <p className="hero-subtitle" style={{ marginTop: 12 }}>
            {new Date(event.date).toLocaleString("ro-RO")} • {event.serviceType}
          </p>

          {event.notes ? (
            <p className="mt-4 text-zinc-300">{event.notes}</p>
          ) : null}

          <div style={{ marginTop: 28 }}>
            <h2 className="section-title">Confirmed lineup</h2>

            <div className="card-list">
              {event.requests.map((request) => (
                <div key={request.id} className="item-card">
                  <div className="item-title">
                    {request.ministryRole}: {request.user.name}
                  </div>
                  <div className="item-meta">{request.user.email}</div>
                </div>
              ))}

              {event.requests.length === 0 ? (
                <div className="item-card">
                  <div className="item-meta">
                    Nu există membri confirmați încă.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
