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
      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white/80">
        {label}
      </span>
    );
  }

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">

        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-[20px] border border-white/10 bg-white/[0.04] p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.16)] backdrop-blur-md sm:rounded-[24px] sm:p-4"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-[clamp(1.2rem,4vw,1.7rem)] font-bold leading-tight text-white">
                    {event.title}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-400">
                    {new Date(event.date).toLocaleString("ro-RO")} •{" "}
                    {event.serviceType}
                  </p>

                  {event.notes ? (
                    <p className="mt-2.5 text-sm leading-6 text-zinc-300">
                      {event.notes}
                    </p>
                  ) : null}
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/[0.10]"
                >
                  View details
                </Link>

                <div className="mt-1">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Confirmed lineup
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    {event.requests.map((request) => (
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

                    {event.requests.length === 0 ? (
                      <div className="rounded-[16px] border border-white/8 bg-black/20 p-3">
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
            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-zinc-400">
              Nu există evenimente.
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
