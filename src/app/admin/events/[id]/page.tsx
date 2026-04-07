import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { removeRequest, sendRequest } from "@/app/admin/events/[id]/actions";
import Navbar from "@/components/navbar";
import ConfirmSubmitButton from "@/components/confirm-submit-button";
import SendRequestForm from "@/components/send-request-form";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      requests: {
        include: {
          user: true,
          department: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const currentEvent = event;

  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const users = await prisma.user.findMany({
    include: {
      blackouts: true,
      userDepartments: {
        include: {
          department: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  function isSameDay(a: Date | string, b: Date | string) {
    const da = new Date(a);
    const db = new Date(b);

    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  }

  const eventDate = currentEvent.date;
  const eventServiceType = currentEvent.serviceType;

  function isUserBlockedForEvent(user: (typeof users)[number]) {
    return user.blackouts.some((blackout) => {
      if (!isSameDay(blackout.date, eventDate)) return false;

      if (blackout.serviceType === "ALL_DAY") return true;
      if (blackout.serviceType === eventServiceType) return true;

      return false;
    });
  }

  const sendRequestUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    blocked: isUserBlockedForEvent(user),
    departments: user.userDepartments.map((item) => ({
      id: item.department.id,
      name: item.department.name,
    })),
  }));

  const acceptedRequests = currentEvent.requests.filter(
    (request) => request.status === "ACCEPTED",
  );

  const pendingRequests = currentEvent.requests.filter(
    (request) => request.status === "PENDING",
  );

  const declinedRequests = currentEvent.requests.filter(
    (request) => request.status === "DECLINED",
  );

  function getRequestLabel(request: (typeof currentEvent.requests)[number]) {
    if (request.department?.name) {
      return request.department.name;
    }

    return request.ministryRole || "Unknown";
  }

  return (
    <>
      <Navbar role="ADMIN" />

      <main className="page-container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{currentEvent.title}</h1>
          </div>

          <p className="mb-2 text-zinc-400">
            {new Date(currentEvent.date).toLocaleString("ro-RO")} •{" "}
            {currentEvent.serviceType}
          </p>

          {currentEvent.notes && (
            <p className="mb-8 text-zinc-300">{currentEvent.notes}</p>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Send request</h2>

              <SendRequestForm
                eventId={currentEvent.id}
                users={sendRequestUsers}
                departments={departments}
                action={sendRequest}
              />
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Confirmed lineup</h2>

              <div className="space-y-3">
                {acceptedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-green-700/40 bg-zinc-950 p-4"
                  >
                    <p className="font-semibold">
                      {getRequestLabel(request)}: {request.user.name}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {request.user.email}
                    </p>
                    <p className="mt-1 text-sm text-green-400">
                      Status: {request.status}
                    </p>

                    <form action={removeRequest} className="mt-3">
                      <input
                        type="hidden"
                        name="requestId"
                        value={request.id}
                      />
                      <input
                        type="hidden"
                        name="eventId"
                        value={currentEvent.id}
                      />

                      <ConfirmSubmitButton
                        message="Ești sigur că vrei să scoți această persoană din eveniment?"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Remove from event
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                ))}

                {acceptedRequests.length === 0 && (
                  <p className="text-zinc-400">No accepted members yet.</p>
                )}
              </div>
            </section>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Pending requests</h2>

              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-yellow-700/40 bg-zinc-950 p-4"
                  >
                    <p className="font-semibold">
                      {request.user.name} - {getRequestLabel(request)}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {request.user.email}
                    </p>
                    <p className="mt-1 text-sm text-yellow-400">
                      Status: {request.status}
                    </p>

                    <form action={removeRequest} className="mt-3">
                      <input
                        type="hidden"
                        name="requestId"
                        value={request.id}
                      />
                      <input
                        type="hidden"
                        name="eventId"
                        value={currentEvent.id}
                      />

                      <ConfirmSubmitButton
                        message="Ești sigur că vrei să scoți această persoană din eveniment?"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Remove from event
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                ))}

                {pendingRequests.length === 0 && (
                  <p className="text-zinc-400">No pending requests.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Declined</h2>

              <div className="space-y-3">
                {declinedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-red-700/40 bg-zinc-950 p-4"
                  >
                    <p className="font-semibold">
                      {request.user.name} - {getRequestLabel(request)}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {request.user.email}
                    </p>
                    <p className="mt-1 text-sm text-red-400">
                      Status: {request.status}
                    </p>

                    <form action={removeRequest} className="mt-3">
                      <input
                        type="hidden"
                        name="requestId"
                        value={request.id}
                      />
                      <input
                        type="hidden"
                        name="eventId"
                        value={currentEvent.id}
                      />

                      <ConfirmSubmitButton
                        message="Ești sigur că vrei să scoți această persoană din eveniment?"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Remove from event
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                ))}

                {declinedRequests.length === 0 && (
                  <p className="text-zinc-400">No declined requests.</p>
                )}
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">All requests</h2>

            <div className="space-y-3">
              {currentEvent.requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <p className="font-semibold">
                    {request.user.name} - {getRequestLabel(request)}
                  </p>
                  <p className="text-sm text-zinc-400">{request.user.email}</p>
                  <p className="mt-1 text-sm text-zinc-300">
                    Status: {request.status}
                  </p>
                </div>
              ))}

              {currentEvent.requests.length === 0 && (
                <p className="text-zinc-400">No requests yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
