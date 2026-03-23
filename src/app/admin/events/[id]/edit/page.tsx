import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { updateEvent } from "../../actions";

function formatDateTimeLocal(date: Date | string) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return notFound();
  }

  return (
    <>
      <Navbar role="ADMIN" />

      <main className="page-container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">Edit event</h1>
          <p className="hero-subtitle" style={{ marginTop: 12 }}>
            Modifică detaliile evenimentului.
          </p>
        </div>

        <section className="glass-card" style={{ padding: 24, maxWidth: 720 }}>
          <form action={updateEvent} style={{ display: "grid", gap: 16 }}>
            <input type="hidden" name="eventId" value={event.id} />

            <div>
              <label className="soft-label">Title</label>
              <input
                name="title"
                type="text"
                className="input-ui"
                defaultValue={event.title}
                required
              />
            </div>

            <div>
              <label className="soft-label">Date and time</label>
              <input
                name="date"
                type="datetime-local"
                className="input-ui"
                defaultValue={formatDateTimeLocal(event.date)}
                required
              />
            </div>

            <div>
              <label className="soft-label">Service type</label>
              <select
                name="serviceType"
                className="input-ui"
                defaultValue={event.serviceType}
              >
                <option value="MORNING">MORNING</option>
                <option value="EVENING">EVENING</option>
              </select>
            </div>

            <div>
              <label className="soft-label">Notes</label>
              <textarea
                name="notes"
                rows={4}
                className="input-ui"
                defaultValue={event.notes || ""}
              />
            </div>

            <button type="submit" className="btn-primary">
              Save changes
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
