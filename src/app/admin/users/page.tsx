import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { createUser, deleteUser } from "./actions";
import SignOutButton from "@/components/sign-out-button";
import Navbar from "@/components/navbar";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <Navbar />
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin - Users</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Create user</h2>

            <form action={createUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-zinc-300">Nume</label>
                <input
                  name="name"
                  type="text"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Parolă
                </label>
                <input
                  name="password"
                  type="password"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">Rol</label>
                <select
                  name="role"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                  defaultValue="MEMBER"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90"
              >
                Create user
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Users list</h2>

            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-zinc-400">{user.email}</p>
                      <p className="mt-1 text-sm text-zinc-300">{user.role}</p>
                    </div>

                    <form action={deleteUser}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-500 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-zinc-400">Nu există useri.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
