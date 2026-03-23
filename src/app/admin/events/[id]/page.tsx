import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { notFound } from "next/navigation";
import { removeRequest, sendRequest } from "@/app/admin/events/[id]/actions";
import Navbar from "@/components/navbar";

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
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!event) {
    return notFound();
  }

  const users = await prisma.user.findMany({
    include: {
      blackouts: true,
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

  const eventDate = event.date;
  const eventServiceType = event.serviceType;

  console.log("EVENT TITLE:", event.title);
  console.log("EVENT DATE:", event.date);
  console.log("EVENT SERVICE TYPE:", eventServiceType);

  users.forEach((user) => {
    console.log(
      "USER:",
      user.name,
      user.blackouts.map((b) => ({
        date: b.date,
        serviceType: b.serviceType,
      })),
    );
  });

  function isUserBlockedForEvent(user: (typeof users)[number]) {
    return user.blackouts.some((blackout) => {
      console.log("CHECKING USER:", user.name);
      console.log("BLACKOUT TYPE:", blackout.serviceType);
      console.log("EVENT TYPE:", eventServiceType);
      console.log("SAME DAY:", isSameDay(blackout.date, eventDate));

      if (!isSameDay(blackout.date, eventDate)) return false;
      if (blackout.serviceType === "ALL_DAY") return true;
      if (blackout.serviceType === eventServiceType) return true;

      return false;
    });
  }

  const acceptedRequests = event.requests.filter(
    (request) => request.status === "ACCEPTED",
  );

  const pendingRequests = event.requests.filter(
    (request) => request.status === "PENDING",
  );

  const declinedRequests = event.requests.filter(
    (request) => request.status === "DECLINED",
  );

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{event.title}</h1>
          </div>

          <p className="mb-2 text-zinc-400">
            {new Date(event.date).toLocaleString("ro-RO")} • {event.serviceType}
          </p>

          {event.notes && <p className="mb-8 text-zinc-300">{event.notes}</p>}

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Send request</h2>

              <form action={sendRequest} className="space-y-4">
                <input type="hidden" name="eventId" value={event.id} />

                <div>
                  <label className="mb-1 block text-sm text-zinc-300">
                    User
                  </label>
                  <select
                    name="userId"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                    required
                  >
                    {users.map((user) => {
                      const blocked = isUserBlockedForEvent(user);

                      return (
                        <option key={user.id} value={user.id}>
                          {user.name} ({blocked ? "BLACKOUT" : "AVAILABLE"})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-zinc-300">
                    Role
                  </label>
                  <select
                    name="role"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                    required
                  >
                    <option value="SOLIST">SOLIST</option>
                    <option value="PIAN">PIAN</option>
                    <option value="CHITARA">CHITARA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="SUNET">SUNET</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90"
                >
                  Send request
                </button>
              </form>
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
                      {request.ministryRole}: {request.user.name}
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
                      <input type="hidden" name="eventId" value={event.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Remove from event
                      </button>
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
                      {request.user.name} - {request.ministryRole}
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
                      <input type="hidden" name="eventId" value={event.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Remove from event
                      </button>
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
                      {request.user.name} - {request.ministryRole}
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
                      <input type="hidden" name="eventId" value={event.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Remove from event
                      </button>
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
              {event.requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <p className="font-semibold">
                    {request.user.name} - {request.ministryRole}
                  </p>
                  <p className="text-sm text-zinc-400">{request.user.email}</p>
                  <p className="mt-1 text-sm text-zinc-300">
                    Status: {request.status}
                  </p>
                </div>
              ))}

              {event.requests.length === 0 && (
                <p className="text-zinc-400">No requests yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
