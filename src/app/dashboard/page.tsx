import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateRequestStatus } from "./actions";
import SignOutButton from "@/components/sign-out-button";
import Navbar from "@/components/navbar";

function getStatusClass(status: string) {
  if (status === "ACCEPTED") return "status-badge status-accepted";
  if (status === "DECLINED") return "status-badge status-declined";
  return "status-badge status-pending";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const requests = await prisma.eventRequest.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingRequests = requests.filter((req) => req.status === "PENDING");
  const acceptedRequests = requests.filter((req) => req.status === "ACCEPTED");
  const declinedRequests = requests.filter((req) => req.status === "DECLINED");

  return (
    <>
      <Navbar role={session.user.role} />
      <main className="page-container">
        <div>
          <div className="brand-subtitle">Salut, {session.user.name}</div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">Worship. Media. Sound.</h1>
          <p className="hero-subtitle" style={{ marginTop: 12, maxWidth: 780 }}>
            Vezi cererile primite, confirmă participarea și accesează rapid
            evenimentele la care ai fost programat.
          </p>
        </div>

        <div className="grid-2">
          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Pending requests</h2>

            <div className="card-list">
              {pendingRequests.map((req) => (
                <div key={req.id} className="item-card">
                  <div className="item-title">{req.event.title}</div>
                  <div className="item-meta">
                    {new Date(req.event.date).toLocaleString("ro-RO")}
                  </div>
                  <div className="item-meta">
                    Rol propus: {req.ministryRole}
                  </div>

                  <span className={getStatusClass(req.status)}>
                    {req.status}
                  </span>

                  <div className="actions-row">
                    <form action={updateRequestStatus}>
                      <input type="hidden" name="requestId" value={req.id} />
                      <input type="hidden" name="status" value="ACCEPTED" />
                      <button className="btn-success">Accept</button>
                    </form>

                    <form action={updateRequestStatus}>
                      <input type="hidden" name="requestId" value={req.id} />
                      <input type="hidden" name="status" value="DECLINED" />
                      <button className="btn-danger">Decline</button>
                    </form>
                  </div>
                </div>
              ))}

              {pendingRequests.length === 0 ? (
                <div className="item-card">
                  <div className="item-meta">Nu ai request-uri pending.</div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">My accepted events</h2>

            <div className="card-list">
              {acceptedRequests.map((req) => (
                <div key={req.id} className="item-card">
                  <div className="item-title">{req.event.title}</div>
                  <div className="item-meta">
                    {new Date(req.event.date).toLocaleString("ro-RO")}
                  </div>
                  <div className="item-meta">
                    Rol confirmat: {req.ministryRole}
                  </div>

                  <span className={getStatusClass(req.status)}>
                    {req.status}
                  </span>

                  <div className="actions-row">
                    <Link
                      href={`/events/${req.event.id}`}
                      className="btn-secondary"
                    >
                      View event
                    </Link>
                  </div>
                </div>
              ))}

              {acceptedRequests.length === 0 ? (
                <div className="item-card">
                  <div className="item-meta">Nu ai evenimente acceptate.</div>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <section className="glass-card" style={{ padding: 24, marginTop: 24 }}>
          <h2 className="section-title">Declined requests</h2>

          <div className="card-list">
            {declinedRequests.map((req) => (
              <div key={req.id} className="item-card">
                <div className="item-title">{req.event.title}</div>
                <div className="item-meta">
                  {new Date(req.event.date).toLocaleString("ro-RO")}
                </div>
                <div className="item-meta">Rol: {req.ministryRole}</div>

                <span className={getStatusClass(req.status)}>{req.status}</span>
              </div>
            ))}

            {declinedRequests.length === 0 ? (
              <div className="item-card">
                <div className="item-meta">Nu ai request-uri refuzate.</div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}
