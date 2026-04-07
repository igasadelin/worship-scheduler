import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { createBlackout, deleteBlackout } from "./actions";
import ConfirmSubmitButton from "@/components/confirm-submit-button";
import { formatBlackoutType, getBlackoutBadgeClass } from "@/lib/format";

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

  function BlackoutTypeBadge({ type }: { type: string }) {
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getBlackoutBadgeClass(
          type,
        )}`}
      >
        {formatBlackoutType(type)}
      </span>
    );
  }

  return (
    <>
      <Navbar role={session.user.role} />

      <main className="page-container">
        <div style={{ marginBottom: 20 }}>
          <h1 className="hero-title">Blackouts</h1>
          <p className="hero-subtitle" style={{ marginTop: 8, maxWidth: 760 }}>
            Adaugă perioadele în care nu poți participa.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)] backdrop-blur-md">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Add blackout
            </h2>

            <form action={createBlackout} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-zinc-300">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  required
                  className="w-full rounded-[18px] border border-white/10 bg-black/35 px-4 py-3 text-white outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-zinc-300">
                  Service type
                </label>
                <select
                  name="serviceType"
                  className="w-full rounded-[18px] border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                  defaultValue="ALL_DAY"
                >
                  <option value="ALL_DAY">Toată ziua</option>
                  <option value="MORNING">🌤️ Dimineața</option>
                  <option value="EVENING">🌙 Seara</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-zinc-300">
                  Note
                </label>
                <textarea
                  name="note"
                  rows={4}
                  placeholder="Opțional"
                  className="w-full rounded-[18px] border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-[18px] bg-gradient-to-r from-red-500 to-red-400 px-4 py-3 text-base font-semibold text-white shadow-[0_10px_30px_rgba(239,68,68,0.28)] transition hover:brightness-110"
              >
                Add blackout
              </button>
            </form>
          </section>

          <section className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)] backdrop-blur-md">
            <h2 className="mb-4 text-lg font-semibold text-white">
              My blackouts
            </h2>

            <div className="flex flex-col gap-3">
              {blackouts.map((blackout) => (
                <div
                  key={blackout.id}
                  className="rounded-[16px] border border-white/8 bg-black/25 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-base font-semibold text-white">
                      {new Date(blackout.date).toLocaleDateString("ro-RO")}
                    </div>
                    <BlackoutTypeBadge type={blackout.serviceType} />
                  </div>

                  {blackout.note ? (
                    <div className="mt-2 text-sm text-zinc-400">
                      {blackout.note}
                    </div>
                  ) : null}

                  <form action={deleteBlackout} className="mt-3">
                    <input
                      type="hidden"
                      name="blackoutId"
                      value={blackout.id}
                    />

                    <ConfirmSubmitButton
                      message="Ești sigur că vrei să ștergi acest blackout?"
                      className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                    >
                      Delete blackout
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ))}

              {blackouts.length === 0 ? (
                <div className="rounded-[16px] border border-white/8 bg-black/20 p-3">
                  <div className="text-sm text-zinc-400">
                    Nu ai blackout-uri setate.
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
