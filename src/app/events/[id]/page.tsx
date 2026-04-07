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
        className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${className}`}
      >
        {label}
      </span>
    );
  }

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)] backdrop-blur-md sm:rounded-[26px] sm:p-4.5">
          <div>
            <h1 className="text-[clamp(1.6rem,5vw,2.4rem)] font-bold leading-tight text-white">
              {currentEvent.title}
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              {new Date(currentEvent.date).toLocaleString("ro-RO")} •{" "}
              {currentEvent.serviceType}
            </p>

            {currentEvent.notes ? (
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {currentEvent.notes}
              </p>
            ) : null}
          </div>

          <div style={{ marginTop: 20 }}>
            <h2 className="mb-3 text-lg font-semibold text-white sm:text-xl">
              Confirmed lineup
            </h2>

            <div className="flex flex-col gap-2.5">
              {currentEvent.requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-[16px] border border-white/8 bg-black/25 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <DepartmentBadge label={getRequestLabel(request)} />
                  </div>

                  <div className="mt-2 text-base font-semibold text-white">
                    {request.user.name}
                  </div>
                </div>
              ))}

              {currentEvent.requests.length === 0 ? (
                <div className="rounded-[16px] border border-white/8 bg-black/20 p-3">
                  <div className="text-sm text-zinc-400">
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
