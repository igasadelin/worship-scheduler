import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { updateUser } from "./actions";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userDepartments: true,
    },
  });

  if (!user) {
    return notFound();
  }

  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <Navbar role="ADMIN" />

      <main className="page-container">
        <div style={{ marginBottom: 28 }}>
          <h1 className="hero-title">Edit user</h1>
          <p className="hero-subtitle" style={{ marginTop: 12, maxWidth: 760 }}>
            Modifică datele utilizatorului și departamentele sale.
          </p>
        </div>

        <section className="glass-card" style={{ padding: 24, maxWidth: 760 }}>
          <form action={updateUser} style={{ display: "grid", gap: 16 }}>
            <input type="hidden" name="userId" value={user.id} />

            <div>
              <label className="soft-label">Name</label>
              <input
                name="name"
                type="text"
                defaultValue={user.name}
                className="input-ui"
                required
              />
            </div>

            <div>
              <label className="soft-label">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={user.email}
                className="input-ui"
                required
              />
            </div>

            <div>
              <label className="soft-label">
                Password (leave empty if unchanged)
              </label>
              <input name="password" type="password" className="input-ui" />
            </div>

            <div>
              <label className="soft-label">Role</label>
              <select name="role" defaultValue={user.role} className="input-ui">
                <option value="ADMIN">ADMIN</option>
                <option value="MEMBER">MEMBER</option>
              </select>
            </div>

            <div>
              <label className="soft-label">Departments</label>

              <div className="grid grid-cols-2 gap-3 mt-2">
                {departments.map((department) => {
                  const checked = user.userDepartments.some(
                    (item) => item.departmentId === department.id,
                  );

                  return (
                    <label
                      key={department.id}
                      className="flex items-center gap-2 text-sm text-white"
                    >
                      <input
                        type="checkbox"
                        name="departments"
                        value={department.id}
                        defaultChecked={checked}
                      />
                      {department.name}
                    </label>
                  );
                })}
              </div>
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
