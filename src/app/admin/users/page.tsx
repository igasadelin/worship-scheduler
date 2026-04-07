import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { createUser, deleteUser } from "./actions";
import Navbar from "@/components/navbar";
import ConfirmSubmitButton from "@/components/confirm-submit-button";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    include: {
      userDepartments: {
        include: {
          department: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <Navbar role="ADMIN" />

      <main className="page-container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">Manage users</h1>
          <p className="hero-subtitle" style={{ marginTop: 12, maxWidth: 760 }}>
            Creează, modifică și șterge utilizatorii platformei.
          </p>
        </div>

        <div className="grid-2">
          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Create user</h2>

            <form action={createUser} style={{ display: "grid", gap: 16 }}>
              <div>
                <label className="soft-label">Name</label>
                <input name="name" type="text" className="input-ui" required />
              </div>

              <div>
                <label className="soft-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input-ui"
                  required
                />
              </div>

              <div>
                <label className="soft-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="input-ui"
                  required
                />
              </div>

              <div>
                <label className="soft-label">Role</label>
                <select name="role" className="input-ui" defaultValue="MEMBER">
                  <option value="MEMBER">MEMBER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">
                Create user
              </button>
            </form>
          </section>

          <section className="glass-card" style={{ padding: 24 }}>
            <h2 className="section-title">Users list</h2>

            <div className="card-list">
              {users.map((user) => (
                <div key={user.id} className="item-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="item-title">{user.name}</div>
                      <div className="item-meta">{user.email}</div>
                      <div className="item-meta" style={{ marginTop: 6 }}>
                        Role: {user.role}
                      </div>

                      <div className="item-meta" style={{ marginTop: 8 }}>
                        Departments:{" "}
                        {user.userDepartments.length > 0
                          ? user.userDepartments
                              .map((item) => item.department.name)
                              .join(", ")
                          : "None"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="btn-secondary"
                      >
                        Edit
                      </Link>

                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={user.id} />

                        <ConfirmSubmitButton
                          message="Ești sigur că vrei să ștergi acest user?"
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </div>
                </div>
              ))}

              {users.length === 0 ? (
                <div className="item-card">
                  <div className="item-meta">Nu există useri.</div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
