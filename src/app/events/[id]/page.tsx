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
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <div>
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-white">
              {currentEvent.title}
            </h1>

            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              {new Date(currentEvent.date).toLocaleString("ro-RO")} •{" "}
              {currentEvent.serviceType}
            </p>

            {currentEvent.notes ? (
              <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
                {currentEvent.notes}
              </p>
            ) : null}
          </div>

          <div style={{ marginTop: 28 }}>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Confirmed lineup
            </h2>

            <div className="flex flex-col gap-4">
              {currentEvent.requests.map((request) => (
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

                  <div className="mt-1 text-sm text-zinc-400">
                    {request.user.email}
                  </div>
                </div>
              ))}

              {currentEvent.requests.length === 0 ? (
                <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
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