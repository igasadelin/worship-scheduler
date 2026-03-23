import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Link from "next/link";
import ConfirmSubmitButton from "@/components/confirm-submit-button";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const events = await prisma.event.findMany({
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
    orderBy: {
      date: "asc",
    },
  });

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">All events</h1>
          <p className="hero-subtitle" style={{ marginTop: 12, maxWidth: 760 }}>
            Vezi toate programele și lineup-ul confirmat pentru fiecare
            eveniment.
          </p>
        </div>

        <div className="card-list">
          {events.map((event) => (
            <div key={event.id} className="glass-card" style={{ padding: 24 }}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {event.title}
                  </h2>
                  <p className="mt-2 text-zinc-400">
                    {new Date(event.date).toLocaleString("ro-RO")} •{" "}
                    {event.serviceType}
                  </p>
                  {event.notes ? (
                    <p className="mt-3 text-zinc-300">{event.notes}</p>
                  ) : null}
                </div>

                <Link href={`/events/${event.id}`} className="btn-secondary">
                  View details
                </Link>
              </div>

              <div style={{ marginTop: 20 }}>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Confirmed lineup
                </h3>

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
          ))}

          {events.length === 0 ? (
            <div className="glass-card" style={{ padding: 24 }}>
              <p className="text-zinc-400">Nu există evenimente.</p>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
