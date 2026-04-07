import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Link from "next/link";

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
          department: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  function getRequestLabel(
    request: (typeof events)[number]["requests"][number],
  ) {
    if (request.department?.name) {
      return request.department.name;
    }

    return request.ministryRole || "Unknown";
  }

  function DepartmentBadge({ label }: { label: string }) {
    return (
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
        {label}
      </span>
    );
  }

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-bold leading-tight text-white">
                    {event.title}
                  </h2>

                  <p className="mt-3 text-sm text-zinc-400 sm:text-base">
                    {new Date(event.date).toLocaleString("ro-RO")} •{" "}
                    {event.serviceType}
                  </p>

                  {event.notes ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
                      {event.notes}
                    </p>
                  ) : null}
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-center text-base font-semibold text-white transition hover:bg-white/[0.10]"
                >
                  View details
                </Link>

                <div className="mt-1">
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Confirmed lineup
                  </h3>

                  <div className="flex flex-col gap-3">
                    {event.requests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-[24px] border border-white/8 bg-black/25 p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <DepartmentBadge label={getRequestLabel(request)} />
                        </div>

                        <div className="mt-3 text-lg font-semibold text-white">
                          {request.user.name}
                        </div>
                      </div>
                    ))}

                    {event.requests.length === 0 ? (
                      <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                        <div className="text-sm text-zinc-400">
                          Nu există membri confirmați încă.
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {events.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-zinc-400">
              Nu există evenimente.
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
