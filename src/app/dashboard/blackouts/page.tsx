import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { createBlackout, deleteBlackout } from "./actions";

export default async function BlackoutsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const blackouts = await prisma.blackout.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div className="grid-2">
          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Add blackout</h2>

            <form action={createBlackout} style={{ display: "grid", gap: 16 }}>
              <div>
                <label className="soft-label">Date</label>
                <input name="date" type="date" className="input-ui" required />
              </div>

              <div>
                <label className="soft-label">Service type</label>
                <select
                  name="serviceType"
                  className="input-ui"
                  defaultValue="ALL_DAY"
                >
                  <option value="ALL_DAY">ALL_DAY</option>
                  <option value="MORNING">MORNING</option>
                  <option value="EVENING">EVENING</option>
                </select>
              </div>

              <div>
                <label className="soft-label">Note</label>
                <textarea
                  name="note"
                  rows={4}
                  className="input-ui"
                  placeholder="Opțional"
                />
              </div>

              <button type="submit" className="btn-primary">
                Add blackout
              </button>
            </form>
          </section>

          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">My blackouts</h2>

            <div className="card-list">
              {blackouts.map((blackout) => (
                <div key={blackout.id} className="item-card">
                  <div className="item-title">
                    {new Date(blackout.date).toLocaleDateString("ro-RO")}
                  </div>

                  <div className="item-meta">
                    Service: {blackout.serviceType}
                  </div>

                  {blackout.note ? (
                    <div className="item-meta" style={{ marginTop: 8 }}>
                      {blackout.note}
                    </div>
                  ) : null}

                  <div className="actions-row">
                    <form action={deleteBlackout}>
                      <input
                        type="hidden"
                        name="blackoutId"
                        value={blackout.id}
                      />
                      <button type="submit" className="btn-secondary">
                        Delete blackout
                      </button>
                    </form>
                  </div>
                </div>
              ))}

              {blackouts.length === 0 ? (
                <div className="item-card">
                  <div className="item-meta">Nu ai blackout-uri setate.</div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
