import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { createEvent } from "./actions";
import SignOutButton from "@/components/sign-out-button";
import Navbar from "@/components/navbar";

export default async function AdminEventsPage() {
  await requireAdmin();

  const events = await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <Navbar />
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin - Events</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Create event</h2>

            <form action={createEvent} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Titlu
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="Ex: 29 Martie 2026"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Dată și oră
                </label>
                <input
                  name="date"
                  type="datetime-local"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Service type
                </label>
                <select
                  name="serviceType"
                  defaultValue="MORNING"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                >
                  <option value="MORNING">MORNING</option>
                  <option value="EVENING">EVENING</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90"
              >
                Create event
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Events list</h2>

            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="font-semibold underline"
                  >
                    {event.title}
                  </Link>

                  <p className="mt-1 text-sm text-zinc-400">
                    {new Date(event.date).toLocaleString("ro-RO")}
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {event.serviceType}
                  </p>

                  {event.notes && (
                    <p className="mt-2 text-sm text-zinc-400">{event.notes}</p>
                  )}
                </div>
              ))}

              {events.length === 0 && (
                <p className="text-zinc-400">Nu există evenimente.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
