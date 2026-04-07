import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { updateRequestStatus } from "./actions";

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
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pending = requests.filter((r) => r.status === "PENDING");
  const accepted = requests.filter((r) => r.status === "ACCEPTED");
  const declined = requests.filter((r) => r.status === "DECLINED");

  function Badge({ label }: { label: string }) {
    return (
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
        {label}
      </span>
    );
  }

  function StatusBadge({ status }: { status: string }) {
    const map = {
      PENDING: "bg-yellow-500/15 text-yellow-400",
      ACCEPTED: "bg-green-500/15 text-green-400",
      DECLINED: "bg-red-500/15 text-red-400",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          map[status as keyof typeof map]
        }`}
      >
        {status}
      </span>
    );
  }

  function getRequestLabel(request: (typeof requests)[number]) {
    if (request.department?.name) {
      return request.department.name;
    }

    return request.ministryRole || "Unknown";
  }

  function RequestCard({ request }: { request: (typeof requests)[number] }) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md shadow-lg">
        <div className="flex flex-col gap-3">
          <div className="text-lg font-semibold">{request.event.title}</div>

          <div className="text-sm text-zinc-400">
            {new Date(request.event.date).toLocaleString("ro-RO")} •{" "}
            {request.event.serviceType}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge label={getRequestLabel(request)} />
            <StatusBadge status={request.status} />
          </div>

          {request.status === "PENDING" && (
            <div className="mt-3 flex gap-3">
              <form action={updateRequestStatus} className="flex-1">
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="status" value="ACCEPTED" />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400 transition hover:bg-green-500/30"
                >
                  Accept
                </button>
              </form>

              <form action={updateRequestStatus} className="flex-1">
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="status" value="DECLINED" />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/30"
                >
                  Decline
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  function Section({
    title,
    data,
  }: {
    title: string;
    data: (typeof requests)[number][];
  }) {
    return (
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>

        <div className="flex flex-col gap-4">
          {data.length > 0 ? (
            data.map((req) => <RequestCard key={req.id} request={req} />)
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-zinc-500">
              Nothing here
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl bg-white/5 px-4 py-2 text-sm">
            Pending: {pending.length}
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-2 text-sm">
            Accepted: {accepted.length}
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-2 text-sm">
            Declined: {declined.length}
          </div>
        </div>

        <Section title="Pending requests" data={pending} />
        <Section title="Accepted" data={accepted} />
        <Section title="Declined" data={declined} />
      </main>
    </>
  );
}
