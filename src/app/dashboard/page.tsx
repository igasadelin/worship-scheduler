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
    orderBy: [
      {
        event: {
          date: "asc",
        },
      },
      {
        createdAt: "asc",
      },
    ],
  });

  const pending = requests.filter((r) => r.status === "PENDING");
  const accepted = requests.filter((r) => r.status === "ACCEPTED");
  const declined = requests.filter((r) => r.status === "DECLINED");

  function getRequestLabel(request: (typeof requests)[number]) {
    if (request.department?.name) {
      return request.department.name;
    }

    return request.ministryRole || "Unknown";
  }

  function DepartmentBadge({ label }: { label: string }) {
    const normalized = label.trim().toLowerCase();

    let className = "bg-white/10 text-white/85 border border-white/10";

    if (normalized === "solist") {
      className = "bg-rose-500/15 text-rose-300 border border-rose-400/20";
    } else if (normalized === "pian") {
      className =
        "bg-violet-500/15 text-violet-300 border border-violet-400/20";
    } else if (normalized === "chitara") {
      className = "bg-blue-500/15 text-blue-300 border border-blue-400/20";
    } else if (normalized === "media") {
      className = "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20";
    } else if (normalized === "sunet") {
      className = "bg-amber-500/15 text-amber-300 border border-amber-400/20";
    } else if (normalized === "coffee") {
      className =
        "bg-orange-500/15 text-orange-300 border border-orange-400/20";
    } else if (normalized === "start") {
      className =
        "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20";
    }

    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}
      >
        {label}
      </span>
    );
  }

  function StatusBadge({ status }: { status: string }) {
    const map = {
      PENDING: "bg-yellow-500/15 text-yellow-400 border border-yellow-400/20",
      ACCEPTED: "bg-green-500/15 text-green-400 border border-green-400/20",
      DECLINED: "bg-red-500/15 text-red-400 border border-red-400/20",
    };

    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
          map[status as keyof typeof map]
        }`}
      >
        {status}
      </span>
    );
  }

  function RequestCard({ request }: { request: (typeof requests)[number] }) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md shadow-lg sm:p-5">
        <div className="flex flex-col gap-2.5">
          <div className="text-base font-semibold sm:text-lg">
            {request.event.title}
          </div>

          <div className="text-sm text-zinc-400">
            {new Date(request.event.date).toLocaleString("ro-RO")} •{" "}
            {request.event.serviceType}
          </div>

          <div className="flex flex-wrap gap-2">
            <DepartmentBadge label={getRequestLabel(request)} />
            <StatusBadge status={request.status} />
          </div>

          {request.status === "PENDING" && (
            <div className="mt-2 flex gap-2.5">
              <form action={updateRequestStatus} className="flex-1">
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="status" value="ACCEPTED" />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-green-500/20 px-4 py-2.5 text-sm font-semibold text-green-400 transition hover:bg-green-500/30"
                >
                  Accept
                </button>
              </form>

              <form action={updateRequestStatus} className="flex-1">
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="status" value="DECLINED" />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/30"
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
      <section className="mt-7">
        <h2 className="mb-3 text-lg font-semibold sm:text-xl">{title}</h2>

        <div className="flex flex-col gap-3.5">
          {data.length > 0 ? (
            data.map((req) => <RequestCard key={req.id} request={req} />)
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-500">
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
        <div className="flex flex-wrap gap-2.5">
          <div className="rounded-xl bg-white/5 px-3.5 py-2 text-sm">
            Pending: {pending.length}
          </div>
          <div className="rounded-xl bg-white/5 px-3.5 py-2 text-sm">
            Accepted: {accepted.length}
          </div>
          <div className="rounded-xl bg-white/5 px-3.5 py-2 text-sm">
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
