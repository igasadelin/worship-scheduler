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
          department: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const currentEvent = event;

  function getRequestLabel(request: (typeof currentEvent.requests)[number]) {
    if (request.department?.name) {
      return request.department.name;
    }

    return request.ministryRole || "Unknown";
  }

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div className="glass-card" style={{ padding: 24 }}>
          <h1
            className="hero-title"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
          >
            {currentEvent.title}
          </h1>

          <p className="hero-subtitle" style={{ marginTop: 12 }}>
            {new Date(currentEvent.date).toLocaleString("ro-RO")} •{" "}
            {currentEvent.serviceType}
          </p>

          {currentEvent.notes ? (
            <p className="mt-4 text-zinc-300">{currentEvent.notes}</p>
          ) : null}

          <div style={{ marginTop: 28 }}>
            <h2 className="section-title">Confirmed lineup</h2>

            <div className="card-list">
              {currentEvent.requests.map((request) => (
                <div key={request.id} className="item-card">
                  <div className="item-title">
                    {getRequestLabel(request)}: {request.user.name}
                  </div>
                  <div className="item-meta">{request.user.email}</div>
                </div>
              ))}

              {currentEvent.requests.length === 0 ? (
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
