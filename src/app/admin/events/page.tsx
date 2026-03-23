import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { createEvent, deleteEvent } from "./actions";
import Navbar from "@/components/navbar";
import ConfirmSubmitButton from "@/components/confirm-submit-button";

export default async function AdminEventsPage() {
  await requireAdmin();

  const events = await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });

  return (
    <>
      <Navbar role="ADMIN" />

      <main className="page-container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">Manage events</h1>
          <p className="hero-subtitle" style={{ marginTop: 12, maxWidth: 760 }}>
            Creează, editează și șterge evenimentele.
          </p>
        </div>

        <div className="grid-2">
          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Create event</h2>

            <form action={createEvent} style={{ display: "grid", gap: 16 }}>
              <div>
                <label className="soft-label">Title</label>
                <input
                  name="title"
                  type="text"
                  className="input-ui"
                  placeholder="Ex: 29 Martie 2026"
                  required
                />
              </div>

              <div>
                <label className="soft-label">Date and time</label>
                <input
                  name="date"
                  type="datetime-local"
                  className="input-ui"
                  required
                />
              </div>

              <div>
                <label className="soft-label">Service type</label>
                <select
                  name="serviceType"
                  className="input-ui"
                  defaultValue="MORNING"
                >
                  <option value="MORNING">MORNING</option>
                  <option value="EVENING">EVENING</option>
                </select>
              </div>

              <div>
                <label className="soft-label">Notes</label>
                <textarea name="notes" rows={4} className="input-ui" />
              </div>

              <button type="submit" className="btn-primary">
                Create event
              </button>
            </form>
          </section>

          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Events list</h2>

            <div className="card-list">
              {events.map((event) => (
                <div key={event.id} className="item-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="item-title"
                      >
                        {event.title}
                      </Link>

                      <div className="item-meta">
                        {new Date(event.date).toLocaleString("ro-RO")}
                      </div>

                      <div className="item-meta">{event.serviceType}</div>

                      {event.notes ? (
                        <div className="item-meta" style={{ marginTop: 8 }}>
                          {event.notes}
                        </div>
                      ) : null}
                    </div>

                    <details className="relative">
                      <summary
                        className="cursor-pointer list-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
                        style={{ lineHeight: 1 }}
                      >
                        ⋮
                      </summary>

                      <div className="absolute right-0 top-12 z-20 min-w-[180px] rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="block rounded-xl px-3 py-2 text-sm text-white transition hover:bg-white/10"
                        >
                          Edit event
                        </Link>

                        <form action={deleteEvent}>
                          <input
                            type="hidden"
                            name="eventId"
                            value={event.id}
                          />

                          <ConfirmSubmitButton
                            message="Ești sigur că vrei să ștergi acest eveniment?"
                            className="block w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                          >
                            Delete event
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </details>
                  </div>
                </div>
              ))}

              {events.length === 0 ? (
                <div className="item-card">
                  <div className="item-meta">Nu există evenimente.</div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
